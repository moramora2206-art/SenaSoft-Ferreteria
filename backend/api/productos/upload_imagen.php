<?php
// Endpoint para subir imagenes de productos
require_once(__DIR__ . "/../../config/database.php");
require_once(__DIR__ . "/../../config/auth.php");

// Solo POST multipart/form-data
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Método no permitido', null, 405, ["errorCode" => "METHOD_NOT_ALLOWED"]);
}

requerirUsuario();

if (!isset($_FILES['imagen'])) {
    jsonResponse(false, 'No se envió ninguna imagen', null, 400, ["errorCode" => "VALIDATION_ERROR"]);
}

$archivo = $_FILES['imagen'];
if ($archivo['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(false, 'Error al subir el archivo', null, 400, ["errorCode" => "UPLOAD_ERROR"]);
}

// Validación tamaño
$maxSize = 5 * 1024 * 1024; // 5MB
if ($archivo['size'] > $maxSize) {
    jsonResponse(false, 'El archivo excede el tamaño máximo de 5 MB', null, 400, ["errorCode" => "VALIDATION_ERROR"]);
}

// Validación MIME
$mime = detectarMimeImagen($archivo['tmp_name'], $archivo['type'] ?? null);
$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
if (!$mime || !array_key_exists($mime, $allowed)) {
    jsonResponse(false, 'Tipo de archivo no permitido', null, 400, ["errorCode" => "VALIDATION_ERROR"]);
}

// Preparar carpeta (backend/uploads/productos, mismo directorio que productos.php)
$uploadDir = realpath(dirname(__DIR__, 2)) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'productos';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        jsonResponse(false, 'No se pudo crear la carpeta de uploads', null, 500, ["errorCode" => "UPLOAD_ERROR"]);
    }
}

// Nombre seguro
$ext = $allowed[$mime];
try {
    $baseName = bin2hex(random_bytes(8));
} catch (Exception $e) {
    $baseName = time() . '_' . bin2hex(openssl_random_pseudo_bytes(6));
}
$filename = $baseName . '.' . $ext;
$target = $uploadDir . DIRECTORY_SEPARATOR . $filename;

if (!move_uploaded_file($archivo['tmp_name'], $target)) {
    jsonResponse(false, 'No se pudo guardar la imagen', null, 500, ["errorCode" => "UPLOAD_ERROR"]);
}

// Normalizar ruta relativa para guardar en BD (ruta desde backend/uploads/productos)
$relativePath = 'uploads/productos/' . $filename;

// Construir URL pública basada en la petición actual o en APP_ORIGIN
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : null;
$backendBase = null;
if ($host) {
    $backendBase = $scheme . '://' . $host;
} else {
    // Fallback a APP_ORIGIN si está configurada
    $backendBase = env('APP_ORIGIN', 'http://localhost:8000');
}

$publicUrl = rtrim($backendBase, '/') . '/' . $relativePath;

jsonResponse(true, 'Imagen subida correctamente', ['ruta' => $relativePath, 'url' => $publicUrl], 201);