<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../controllers/AuthController.php");

$datos = json_decode(file_get_contents("php://input"));

if (!$datos || empty($datos->usuario) || empty($datos->password)) {
    jsonResponse(false, "Usuario y contraseña son requeridos.", null, 400);
}

$auth = new AuthController($conn);
$res = $auth->login($datos);

if ($res["success"]) {
    jsonResponse(true, $res["mensaje"], $res["usuario"]);
} else {
    jsonResponse(false, $res["mensaje"], null, 401);
}