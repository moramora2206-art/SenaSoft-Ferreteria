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
