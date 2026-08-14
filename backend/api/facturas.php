<?php

require_once(__DIR__ . "/../config/database.php");
<<<<<<< HEAD
require_once(__DIR__ . "/../config/auth.php");
require_once(__DIR__ . "/../controllers/FacturaController.php");

$controller = new FacturaController($conn);

$method = $_SERVER['REQUEST_METHOD'];

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

            jsonResponse(
                $res["success"],
                $res["message"] ?? "",
                $res["data"] ?? null,
                $res["success"] ? 200 : 404
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

        if (!$datos) {

            jsonResponse(
                false,
                "Datos de la factura inválidos.",
                null,
                400
            );

            exit;
        }

        /*
         * El usuario viene de la sesión.
         * No confiamos en idUsuario enviado
         * desde React.
         */
        $datos->idUsuario = $idUsuario;

        $res = $controller->guardar($datos);

        jsonResponse(
            $res["success"],
            $res["message"],
            isset($res["facturaId"])
                ? [
                    "facturaId" => $res["facturaId"],
                    "total" => $res["total"] ?? null
                ]
                : null,
            $res["success"] ? 201 : 400
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
                400
            );

            exit;
        }

        /*
         * IMPORTANTE:
         * Ya no eliminamos físicamente la factura.
         * Se ANULA y devuelve stock.
         */
        $res = $controller->anular($id);

        jsonResponse(
            $res["success"],
            $res["message"],
            null,
            $res["success"] ? 200 : 400
        );

        break;


    default:

        jsonResponse(
            false,
            "Método no permitido.",
            null,
            405
        );

        break;
}
=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
