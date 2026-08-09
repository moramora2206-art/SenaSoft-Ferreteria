<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../controllers/FacturaController.php");

$controller = new FacturaController($conn);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id']) && !empty($_GET['id'])) {
            $res = $controller->buscarPorId(intval($_GET['id']));
            jsonResponse($res["success"], $res["message"] ?? "", $res["data"] ?? null, $res["success"] ? 200 : 404);
        } else {
            $res = $controller->listar();
            jsonResponse($res["success"], "Lista de facturas", $res["data"]);
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents("php://input"));
        if (!$datos) {
            jsonResponse(false, "Datos de la factura inválidos", null, 400);
        }
        $res = $controller->guardar($datos);
        jsonResponse($res["success"], $res["message"], isset($res["facturaId"]) ? ["facturaId" => $res["facturaId"]] : null, $res["success"] ? 201 : 400);
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id <= 0) {
            jsonResponse(false, "ID requerido", null, 400);
        }
        $res = $controller->eliminar($id);
        jsonResponse($res["success"], $res["message"], null, $res["success"] ? 200 : 400);
        break;

    default:
        jsonResponse(false, "Método no permitido", null, 405);
        break;
}
