<?php

// =====================================================
// CARGAR VARIABLES DE ENTORNO
// =====================================================

$projectRoot = realpath(dirname(__DIR__, 2)) ?: dirname(__DIR__, 2);
$envFile = $projectRoot . DIRECTORY_SEPARATOR . '.env';

$env = [];

if (file_exists($envFile) && is_readable($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $line = trim($line);

        if ($line === '' || $line[0] === '#') {
            continue;
        }

        if (strpos($line, '=') === false) {
            continue;
        }

        [$k, $v] = array_map('trim', explode('=', $line, 2));
        $v = preg_replace('/^"|"$/', '', $v);
        $v = preg_replace("/^'|'$/", '', $v);

        $env[$k] = $v;
    }
}


// =====================================================
// FUNCION ENV
// =====================================================

function env($key, $default = null)
{
    global $env;

    $val = getenv($key);

    if ($val !== false) {
        return $val;
    }

    return $env[$key] ?? $default;
}


// Detecta el tipo MIME real de una imagen.
// Usa finfo si está disponible (extensión fileinfo); de lo contrario
// cae a getimagesize(). Si no se puede validar, retorna null.
// El tipo declarado por el cliente NO se usa como validación, ya que
// puede ser suplantado (spoofing) para colar archivos no-imagen.
function detectarMimeImagen($ruta, $fallbackMime = null)
{
    if (class_exists('finfo')) {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($ruta);
        if ($mime !== false && $mime !== '') {
            return $mime;
        }
    }

    if (function_exists('getimagesize')) {
        $info = @getimagesize($ruta);
        if ($info !== false && isset($info['mime'])) {
            return $info['mime'];
        }
    }

    return null;
}


// =====================================================
// RESPUESTA JSON
// =====================================================

function jsonResponse($success, $message, $data = null, $code = 200, $extra = [])
{
    http_response_code($code);

    $response = [
        'success' => $success,
        'message' => $message
    ];

    if ($data !== null) {
        $response['data'] = $data;
    }

    if (!empty($extra) && is_array($extra)) {
        $response = array_merge($response, $extra);
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}


// =====================================================
// CÓDIGO HTTP SEGÚN errorCode
// =====================================================

function codigoHttpParaError($errorCode)
{
    switch ($errorCode) {
        case 'VALIDATION_ERROR':
        case 'INVALID_JSON':
        case 'INVALID_EMAIL':
        case 'INVALID_PASSWORD':
        case 'INVALID_ID':
        case 'INVALID_FECHAS':
            return 400;

        case 'DUPLICATE_EMAIL':
        case 'DUPLICATE_USERNAME':
        case 'USER_ALREADY_EXISTS':
        case 'DUPLICATE_CEDULA':
        case 'DUPLICATE_NIT':
        case 'DUPLICATE_CODE':
        case 'FOREIGN_KEY_CONSTRAINT':
        case 'INSUFFICIENT_STOCK':
        case 'FACTURA_YA_ANULADA':
            return 409;

        case 'NOT_FOUND':
        case 'PRODUCTO_NO_ENCONTRADO':
        case 'FACTURA_NO_ENCONTRADA':
        case 'CLIENTE_NO_ENCONTRADO':
            return 404;

        default:
            return 500;
    }
}


// =====================================================
// CONFIGURACION CORS
// =====================================================

function configurarCors()
{
    $defaultOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
    ];

    $configuredOrigins = array_filter(array_map(
        'trim',
        explode(',', env('APP_ALLOWED_ORIGINS', env('APP_ORIGIN', '')))
    ));

    $allowedOrigins = array_values(array_unique(array_merge(
        $defaultOrigins,
        $configuredOrigins
    )));

    $fallbackOrigin = $allowedOrigins[0];
    $requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? null;
    $responseOrigin = in_array($requestOrigin, $allowedOrigins, true)
        ? $requestOrigin
        : $fallbackOrigin;

    header('Access-Control-Allow-Origin: ' . $responseOrigin);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-User-Id, Accept');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Content-Type: application/json; charset=UTF-8');
}

configurarCors();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit();
}


// =====================================================
// SESIONES
// =====================================================

function startAppSession()
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $secure = (
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['SERVER_PORT'] ?? null) === '443')
    );

    session_name(env('APP_SESSION_NAME', 'SENASOFT_SESSION'));
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => env('APP_SESSION_SAMESITE', 'Lax'),
    ]);

    session_start();
}

function clearAppSessionCookie()
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        return;
    }

    $params = session_get_cookie_params();

    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'],
        $params['domain'],
        $params['secure'],
        $params['httponly']
    );
}


// =====================================================
// TIEMPO DE INACTIVIDAD DE SESIÓN (segundos)
// =====================================================
// Valor único de configuración: 1800 s = 30 minutos.
// Se puede sobrescribir desde .env con SESSION_IDLE_TIMEOUT.

if (!defined('SESSION_IDLE_TIMEOUT')) {
    define('SESSION_IDLE_TIMEOUT', (int) env('SESSION_IDLE_TIMEOUT', 1800));
}


// =====================================================
// VALIDACIÓN DE NÚMEROS ENTEROS
// =====================================================
// Evita convertir silenciosamente decimales (5.8 -> 5) mediante intval().

function esEntero($valor)
{
    if (is_int($valor)) {
        return true;
    }

    if (is_string($valor)) {
        $trim = trim($valor);
        return $trim !== '' && preg_match('/^-?\d+$/', $trim) === 1;
    }

    if (is_float($valor)) {
        return floor($valor) == $valor;
    }

    return false;
}


// =====================================================
// ELIMINACIÓN SEGURA DE IMÁGENES DE PRODUCTOS
// =====================================================
// Solo elimina archivos locales dentro de uploads/productos con nombre seguro.
// No lanza errores si el archivo ya no existe. Retorna true si se eliminó.

function eliminarImagenProducto($imagenRuta)
{
    if (!is_string($imagenRuta) || trim($imagenRuta) === '') {
        return false;
    }

    $valor = trim($imagenRuta);

    // Solo rutas relativas locales tipo uploads/productos/<nombre-seguro>
    if (preg_match('~^uploads/productos/[A-Za-z0-9._-]+$~', $valor) !== 1) {
        return false;
    }

    $backendRoot = realpath(dirname(__DIR__, 1));
    $uploadDir = realpath($backendRoot . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'productos');

    if ($uploadDir === false) {
        return false;
    }

    $absoluta = realpath($backendRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $valor));

    // Evitar path traversal: el archivo debe estar dentro de uploads/productos
    if ($absoluta === false || strpos($absoluta, $uploadDir) !== 0) {
        return false;
    }

    if (!is_file($absoluta)) {
        return false;
    }

    return @unlink($absoluta);
}


// =====================================================
// CONFIGURACION BASE DE DATOS
// =====================================================

$host = env('DB_HOST', 'localhost');
$user = env('DB_USER', 'root');
$password = env('DB_PASS', 'Car*2011');
$dbname = env('DB_NAME', 'softwarefacturacion');


// =====================================================
// CONEXION
// =====================================================

mysqli_report(MYSQLI_REPORT_OFF);

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    error_log('Error de conexion MySQL: ' . $conn->connect_error);

    jsonResponse(
        false,
        'Error de conexión a la base de datos.',
        null,
        500,
        ['errorCode' => 'DB_CONNECTION_ERROR']
    );
}

if (!$conn->set_charset('utf8mb4')) {
    error_log('Error configurando utf8mb4: ' . $conn->error);

    jsonResponse(
        false,
        'Error configurando la conexión a la base de datos.',
        null,
        500,
        ['errorCode' => 'DB_CHARSET_ERROR']
    );
}
