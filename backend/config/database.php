<?php

<<<<<<< HEAD
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

=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        $env[$k] = $v;
    }
}

<<<<<<< HEAD

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


// =====================================================
// RESPUESTA JSON
// =====================================================

function jsonResponse($success, $message, $data = null, $code = 200, $extra = [])
{
    http_response_code($code);

=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    $response = [
        'success' => $success,
        'message' => $message
    ];
<<<<<<< HEAD

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
// CONFIGURACION BASE DE DATOS
// =====================================================

$host = env('DB_HOST', 'sql202.infinityfree.com');
$user = env('DB_USER', 'if0_42654115');
$password = env('DB_PASS', 'GAQw0q6AvD');
$dbname = env('DB_NAME', 'if0_42654115_XXX');


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
=======
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
