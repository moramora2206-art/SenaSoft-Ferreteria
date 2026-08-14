<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../controllers/DashboardController.php");

$controller = new DashboardController($conn);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $res = $controller->obtenerMetricas();
    jsonResponse($res["success"], "Métricas del Dashboard", $res["data"]);
} else {
    jsonResponse(false, "Método no permitido", null, 405);
}
