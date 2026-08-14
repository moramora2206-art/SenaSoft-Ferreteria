<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../controllers/AuthController.php");

<<<<<<< HEAD
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
=======
$datos = json_decode(file_get_contents("php://input"));

if (!$datos || empty($datos->usuario) || empty($datos->password)) {
    jsonResponse(false, "Usuario y contraseña son requeridos.", null, 400);
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
}

$auth = new AuthController($conn);
$res = $auth->login($datos);

if ($res["success"]) {
<<<<<<< HEAD
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
=======
    jsonResponse(true, $res["mensaje"], $res["usuario"]);
} else {
    jsonResponse(false, $res["mensaje"], null, 401);
}
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
