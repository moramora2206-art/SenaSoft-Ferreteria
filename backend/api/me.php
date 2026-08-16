<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../config/auth.php");
require_once(__DIR__ . "/../models/Usuario.php");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, "Método no permitido.", null, 405, [
        "errorCode" => "METHOD_NOT_ALLOWED"
    ]);
}

$idUsuario = obtenerUsuarioActual();

if ($idUsuario === null) {
    if (sesionExpirada()) {
        destruirSesionExpirada();

        jsonResponse(false, "Tu sesión ha expirado. Inicia sesión nuevamente.", null, 401, [
            "errorCode" => "SESSION_EXPIRED"
        ]);
    }

    jsonResponse(false, "Sesión no válida.", null, 401, [
        "errorCode" => "INVALID_SESSION"
    ]);
}

$usuarioModel = new Usuario($conn);
$usuario = $usuarioModel->buscarPorId($idUsuario);

if (!$usuario) {
    destruirSesionExpirada();

    jsonResponse(false, "Sesión no válida.", null, 401, [
        "errorCode" => "INVALID_SESSION"
    ]);
}

$_SESSION["lastActivity"] = time();

jsonResponse(true, "Usuario autenticado.", $usuario);