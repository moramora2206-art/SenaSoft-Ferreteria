<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../config/auth.php");
require_once(__DIR__ . "/../controllers/DashboardController.php");

requerirUsuario();

$controller = new DashboardController($conn);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $res = $controller->obtenerMetricas();
    jsonResponse(
        $res["success"],
        $res["success"] ? "Métricas del Dashboard" : ($res["message"] ?? "No se pudieron obtener las métricas."),
        $res["data"] ?? null,
        $res["success"] ? 200 : (isset($res["errorCode"]) ? codigoHttpParaError($res["errorCode"]) : 500),
        isset($res["errorCode"]) ? ["errorCode" => $res["errorCode"]] : []
    );
} else {
    jsonResponse(false, "Método no permitido", null, 405, ["errorCode" => "METHOD_NOT_ALLOWED"]);
}