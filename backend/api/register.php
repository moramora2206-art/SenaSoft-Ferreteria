<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../controllers/AuthController.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Método no permitido.", null, 405, [
        "errorCode" => "METHOD_NOT_ALLOWED"
    ]);
}

$datos = json_decode(file_get_contents("php://input"));

if (json_last_error() !== JSON_ERROR_NONE || !$datos) {
    jsonResponse(false, "JSON inválido.", null, 400, [
        "errorCode" => "INVALID_JSON"
    ]);
}

$auth = new AuthController($conn);
$res = $auth->registrar($datos);

$code = $res["success"]
    ? 201
    : (isset($res["errorCode"]) ? codigoHttpParaError($res["errorCode"]) : 400);

jsonResponse(
    $res["success"],
    $res["mensaje"],
    null,
    $code,
    isset($res["errorCode"]) ? ["errorCode" => $res["errorCode"]] : []
);
