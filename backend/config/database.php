<?php

// Configuración de Origen CORS (Permitir Vite dev server en http://localhost:5173 o dinamico)
$allowed_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'http://localhost:5173';
if ($allowed_origin === 'http://localhost:5173' || $allowed_origin === 'http://localhost:5174' || $allowed_origin === 'http://127.0.0.1:5173') {
    header("Access-Control-Allow-Origin: " . $allowed_origin);
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Manejo de peticiones preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$user = "root";
$password = "Car*2011";
$dbname = "softwarefacturacion";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "mensaje" => "Error de conexión a la base de datos: " . $conn->connect_error
    ]);
    exit();
}

$conn->set_charset("utf8mb4");

function jsonResponse($success, $message, $data = null, $code = 200) {
    http_response_code($code);
    $response = [
        "success" => $success,
        "message" => $message
    ];
    if ($data !== null) {
        $response["data"] = $data;
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}