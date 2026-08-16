<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../controllers/AuthController.php");

startAppSession();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Método no permitido.", null, 405, [
        "errorCode" => "METHOD_NOT_ALLOWED"
    ]);
}

$rawBody = file_get_contents("php://input");
$datos = json_decode($rawBody);

if (json_last_error() !== JSON_ERROR_NONE || !$datos) {
    jsonResponse(false, "JSON inválido.", null, 400, [
        "errorCode" => "INVALID_JSON"
    ]);
}

$auth = new AuthController($conn);
$res = $auth->login($datos);

if ($res["success"]) {
    session_regenerate_id(true);

    $_SESSION["idUsuario"] = intval($res["usuario"]["idUsuario"]);
    $_SESSION["usuario"] = $res["usuario"]["usuario"];
    $_SESSION["rol"] = $res["usuario"]["rol"];
    $_SESSION["lastActivity"] = time();

    jsonResponse(true, $res["mensaje"], $res["usuario"]);
}

jsonResponse(
    false,
    $res["mensaje"],
    null,
    $res["status"] ?? 401,
    ["errorCode" => $res["errorCode"] ?? "LOGIN_FAILED"]
);
