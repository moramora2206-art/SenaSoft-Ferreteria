<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../controllers/ClienteController.php");

$controller = new ClienteController($conn);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id']) && !empty($_GET['id'])) {
            $res = $controller->buscarPorId(intval($_GET['id']));
            jsonResponse($res["success"], $res["message"] ?? "", $res["data"] ?? null, $res["success"] ? 200 : 404);
        } else {
            $res = $controller->listar($_GET);
            jsonResponse($res["success"], "Lista de clientes", $res["data"]);
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents("php://input"));
        if (!$datos) {
            jsonResponse(false, "Datos inválidos", null, 400);
        }
        $res = $controller->guardar($datos);
        jsonResponse($res["success"], $res["message"], null, $res["success"] ? 201 : 400);
        break;

    case 'PUT':
        $datos = json_decode(file_get_contents("php://input"));
        if (!$datos) {
            jsonResponse(false, "Datos inválidos", null, 400);
        }
        $res = $controller->actualizar($datos);
        jsonResponse($res["success"], $res["message"], null, $res["success"] ? 200 : 400);
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
