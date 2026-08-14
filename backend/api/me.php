<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../models/Usuario.php");

startAppSession();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(false, "Método no permitido.", null, 405, [
        "errorCode" => "METHOD_NOT_ALLOWED"
    ]);
}

$idUsuario = isset($_SESSION["idUsuario"]) ? intval($_SESSION["idUsuario"]) : 0;

if ($idUsuario <= 0) {
    jsonResponse(false, "Sesión no válida.", null, 401, [
        "errorCode" => "INVALID_SESSION"
    ]);
}

$usuarioModel = new Usuario($conn);
$usuario = $usuarioModel->buscarPorId($idUsuario);

if (!$usuario) {
    session_unset();
    session_destroy();
    clearAppSessionCookie();

    jsonResponse(false, "Sesión no válida.", null, 401, [
        "errorCode" => "INVALID_SESSION"
    ]);
}

$_SESSION["lastActivity"] = time();

jsonResponse(true, "Usuario autenticado.", $usuario);
