<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../config/auth.php");
require_once(__DIR__ . "/../controllers/FacturaController.php");

$controller = new FacturaController($conn);

$method = $_SERVER['REQUEST_METHOD'];

$errorExtra = function ($res) {
    return isset($res["errorCode"]) ? ["errorCode" => $res["errorCode"]] : [];
};

switch ($method) {

    /*
     * =========================
     * LISTAR / BUSCAR
     * =========================
     */
    case 'GET':

        if (isset($_GET['id']) && !empty($_GET['id'])) {

            $res = $controller->buscarPorId(
                intval($_GET['id'])
            );

            $code = $res["success"] ? 200 : (isset($res["errorCode"]) ? codigoHttpParaError($res["errorCode"]) : 404);

            jsonResponse(
                $res["success"],
                $res["message"] ?? ($res["success"] ? "" : "Factura no encontrada."),
                $res["data"] ?? null,
                $code,
                $errorExtra($res)
            );

        } else {

            $res = $controller->listar();

            jsonResponse(
                $res["success"],
                "Lista de facturas",
                $res["data"]
            );
        }

        break;


    /*
     * =========================
     * CREAR FACTURA
     * =========================
     */
    case 'POST':

        /*
         * Identificar al usuario mediante
         * la sesión del servidor.
         */
        $idUsuario = requerirUsuario();

        $datos = json_decode(
            file_get_contents("php://input")
        );

        if (json_last_error() !== JSON_ERROR_NONE || !$datos) {

            jsonResponse(
                false,
                "JSON inválido.",
                null,
                400,
                ["errorCode" => "INVALID_JSON"]
            );
        }

        /*
         * El usuario viene de la sesión.
         * No confiamos en idUsuario enviado
         * desde React.
         */
        $datos->idUsuario = $idUsuario;

        $res = $controller->guardar($datos);

        $code = $res["success"]
            ? 201
            : (isset($res["errorCode"]) ? codigoHttpParaError($res["errorCode"]) : 400);

        jsonResponse(
            $res["success"],
            $res["message"] ?? "",
            isset($res["facturaId"])
                ? [
                    "facturaId" => $res["facturaId"],
                    "total" => $res["total"] ?? null
                ]
                : null,
            $code,
            $errorExtra($res)
        );

        break;


    /*
     * =========================
     * ANULAR FACTURA
     * =========================
     */
    case 'DELETE':

        requerirUsuario();

        $id = isset($_GET['id'])
            ? intval($_GET['id'])
            : 0;

        if ($id <= 0) {

            jsonResponse(
                false,
                "ID requerido.",
                null,
                400,
                ["errorCode" => "VALIDATION_ERROR"]
            );
        }

        /*
         * IMPORTANTE:
         * Ya no eliminamos físicamente la factura.
         * Se ANULA y devuelve stock.
         */
        $res = $controller->anular($id);

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

        jsonResponse(
            false,
            "Método no permitido.",
            null,
            405,
            ["errorCode" => "METHOD_NOT_ALLOWED"]
        );

        break;
}