<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../config/auth.php");
require_once(__DIR__ . "/../controllers/ProveedorController.php");

requerirUsuario();

$controller = new ProveedorController($conn);
$method = $_SERVER['REQUEST_METHOD'];

$errorExtra = function ($res) {
    return isset($res["errorCode"]) ? ["errorCode" => $res["errorCode"]] : [];
};

switch ($method) {
    case 'GET':
        if (isset($_GET['id']) && !empty($_GET['id'])) {
            $res = $controller->buscarPorId(intval($_GET['id']));
            $code = $res["success"] ? 200 : (isset($res["errorCode"]) ? codigoHttpParaError($res["errorCode"]) : 404);
            jsonResponse(
                $res["success"],
                $res["message"] ?? ($res["success"] ? "" : "Proveedor no encontrado."),
                $res["data"] ?? null,
                $code,
                $errorExtra($res)
            );
        } else {
            $res = $controller->listar($_GET);
            jsonResponse($res["success"], "Lista de proveedores", $res["data"]);
        }
        break;

    case 'POST':
        $datos = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE || !$datos) {
            jsonResponse(false, "JSON inválido.", null, 400, ["errorCode" => "INVALID_JSON"]);
        }
        $res = $controller->guardar($datos);
        $code = $res["success"]
            ? 201
            : (isset($res["errorCode"]) ? codigoHttpParaError($res["errorCode"]) : 400);
        jsonResponse(
            $res["success"],
            $res["message"] ?? "",
            $res["data"] ?? null,
            $code,
            $errorExtra($res)
        );
        break;

    case 'PUT':
        $datos = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE || !$datos) {
            jsonResponse(false, "JSON inválido.", null, 400, ["errorCode" => "INVALID_JSON"]);
        }
        $res = $controller->actualizar($datos);
        $code = $res["success"]
            ? 200
            : (isset($res["errorCode"]) ? codigoHttpParaError($res["errorCode"]) : 400);
        jsonResponse(
            $res["success"],
            $res["message"] ?? "",
            $res["data"] ?? null,
            $code,
            $errorExtra($res)
        );
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id <= 0) {
            jsonResponse(false, "ID requerido", null, 400, ["errorCode" => "VALIDATION_ERROR"]);
        }
        $res = $controller->eliminar($id);
        $code = $res["success"]
            ? 200
            : (isset($res["errorCode"]) ? codigoHttpParaError($res["errorCode"]) : 400);
        jsonResponse(
            $res["success"],
            $res["message"] ?? "",
            null,
            $code,
            $errorExtra($res)
        );
        break;

    default:
        jsonResponse(false, "Método no permitido", null, 405, ["errorCode" => "METHOD_NOT_ALLOWED"]);
        break;
}