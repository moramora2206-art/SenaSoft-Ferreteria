<?php

// Cargar variables de entorno desde .env en la raíz del proyecto (si existe)
$projectRoot = realpath(dirname(__DIR__, 2)) ?: dirname(__DIR__, 2);
$envFile = $projectRoot . DIRECTORY_SEPARATOR . '.env';
$env = [];
if (file_exists($envFile) && is_readable($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        if (strpos($line, '=') === false) continue;
        list($k, $v) = array_map('trim', explode('=', $line, 2));
        // Remove optional quotes
        $v = preg_replace('/^\"|\"$|^\'\'|\'\'$/', '', $v);
        $env[$k] = $v;
    }
}

function env($key, $default = null) {
    global $env;
    $val = getenv($key);
    if ($val !== false) return $val;
    if (isset($env[$key])) return $env[$key];
    return $default;
}

// Configuración de Origen CORS
$requestOrigin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : null;
$allowedOrigin = env('APP_ORIGIN', 'http://localhost:5173');
$allowedOriginsFallback = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173'
];

if ($requestOrigin) {
    // Permitir si coincide con la variable APP_ORIGIN o con los orígenes de desarrollo conocidos
    if ($requestOrigin === $allowedOrigin || in_array($requestOrigin, $allowedOriginsFallback, true)) {
        header('Access-Control-Allow-Origin: ' . $requestOrigin);
    } else {
        // No exponer origenes arbitrarios; usar la configuración por defecto
        header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    }
} else {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Content-Type: application/json; charset=UTF-8');

// Manejo de peticiones preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de la base de datos desde variables de entorno
$host = env('DB_HOST', 'localhost');
$user = env('DB_USER', 'root');
$password = env('DB_PASS', '');
$dbname = env('DB_NAME', 'softwarefacturacion');

// Conexión
$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    // Respondemos en JSON para mantener consistencia con la API pero sin exponer credenciales
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos: ' . $conn->connect_error
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

$conn->set_charset('utf8mb4');

function jsonResponse($success, $message, $data = null, $code = 200) {
    http_response_code($code);
    $response = [
        'success' => $success,
        'message' => $message
    ];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}
