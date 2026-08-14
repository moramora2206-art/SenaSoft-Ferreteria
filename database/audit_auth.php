<?php

require_once(__DIR__ . "/../backend/config/database.php");
require_once(__DIR__ . "/../backend/models/Usuario.php");

if (PHP_SAPI !== 'cli') {
    jsonResponse(false, 'Este script solo debe ejecutarse por CLI.', null, 403);
}

$usuarioArg = $argv[1] ?? 'root';
$passwordArg = $argv[2] ?? '';

$columns = [];
$result = $conn->query("
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'usuarios'
    ORDER BY ORDINAL_POSITION
");

while ($result && ($row = $result->fetch_assoc())) {
    $columns[] = $row['COLUMN_NAME'];
}

$model = new Usuario($conn);
$usuario = $model->buscarPorUsuario($usuarioArg);

echo "BD: " . $conn->query("SELECT DATABASE() AS db")->fetch_assoc()['db'] . PHP_EOL;
echo "Tabla usuarios: " . (empty($columns) ? "NO encontrada" : "OK") . PHP_EOL;
echo "Columnas: " . implode(', ', $columns) . PHP_EOL;
echo "Usuario '{$usuarioArg}': " . ($usuario ? "encontrado" : "no encontrado") . PHP_EOL;

if ($usuario) {
    $hash = $usuario['passwordHash'] ?? '';
    $isHash = password_get_info($hash)['algo'] !== 0;

    echo "Password almacenado: " . ($isHash ? "hash compatible con password_verify" : "NO parece hash de password_hash") . PHP_EOL;

    if ($passwordArg !== '') {
        echo "password_verify: " . (password_verify($passwordArg, $hash) ? "OK" : "FAIL") . PHP_EOL;
    }
}
