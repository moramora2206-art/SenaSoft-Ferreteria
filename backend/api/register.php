<?php

header("Content-Type: application/json");

require_once("../config/database.php");
require_once("../controllers/AuthController.php");

$datos = json_decode(file_get_contents("php://input"));

$auth = new AuthController($conn);

echo json_encode(
    $auth->registrar($datos)
);