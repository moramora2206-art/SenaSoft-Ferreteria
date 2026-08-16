<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../config/auth.php");
require_once(__DIR__ . "/../controllers/ProductoController.php");

requerirUsuario();

$controller = new ProductoController($conn);
$method = $_SERVER['REQUEST_METHOD'];

$errorExtra = function ($res) {
    return isset($res["errorCode"]) ? ["errorCode" => $res["errorCode"]] : [];
};

switch ($method) {

    case 'GET':

        if (isset($_GET['id']) && intval($_GET['id']) > 0) {

            $id = intval($_GET['id']);

            $res = $controller->buscarPorId($id);

            $code = $res["success"] ? 200 : (isset($res["errorCode"]) ? codigoHttpParaError($res["errorCode"]) : 404);

            jsonResponse(
                $res["success"],
                $res["message"] ?? ($res["success"] ? "Producto encontrado." : "Producto no encontrado."),
                $res["data"] ?? null,
                $code,
                $errorExtra($res)
            );
        }

        $res = $controller->listar($_GET);

        jsonResponse(
            true,
            "Lista de productos.",
            $res["data"]
        );

        break;


    case 'POST':

        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        $datos = null;

        if (
            stripos($contentType, 'multipart/form-data') !== false
            || !empty($_FILES)
        ) {

            $nombreProducto = trim($_POST['nombreProducto'] ?? '');
            $codigoSKU = trim($_POST['codigoSKU'] ?? '');
            // Se pasa el valor crudo para que el controlador valide enteros
            // (evita truncar 5.8 -> 5 antes de la validación).
            $stock = isset($_POST['stock']) ? $_POST['stock'] : 0;
            $precioUnitario = floatval($_POST['precioUnitario'] ?? 0);
            $precioCompra = null;
            if (
                isset($_POST['precioCompra'])
                && trim((string) $_POST['precioCompra']) !== ''
            ) {
                $precioCompra = $_POST['precioCompra'];
            }

            $categoria = trim($_POST['categoria'] ?? 'General');
            $fechaVencimiento = trim($_POST['fechaVencimiento'] ?? '');
            $descripcion = trim($_POST['descripcion'] ?? '');

            $idProveedor = isset($_POST['idProveedor'])
                ? intval($_POST['idProveedor'])
                : null;

            $imagenRuta = null;

            if (
                isset($_FILES['imagen']) &&
                $_FILES['imagen']['error'] === UPLOAD_ERR_OK
            ) {

                $archivo = $_FILES['imagen'];

                if ($archivo['size'] > 5 * 1024 * 1024) {
                    jsonResponse(
                        false,
                        "El archivo excede el tamaño máximo de 5 MB.",
                        null,
                        400,
                        ["errorCode" => "VALIDATION_ERROR"]
                    );
                }

                $mime = detectarMimeImagen($archivo['tmp_name'], $archivo['type'] ?? null);

                $allowed = [
                    'image/jpeg' => 'jpg',
                    'image/png'  => 'png',
                    'image/webp' => 'webp'
                ];

                if (!$mime || !isset($allowed[$mime])) {
                    jsonResponse(
                        false,
                        "Tipo de imagen no permitido.",
                        null,
                        400,
                        ["errorCode" => "VALIDATION_ERROR"]
                    );
                }

                $uploadDir =
                    dirname(__DIR__) .
                    DIRECTORY_SEPARATOR .
                    "uploads" .
                    DIRECTORY_SEPARATOR .
                    "productos";

                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }

                $filename =
                    bin2hex(random_bytes(8)) .
                    "." .
                    $allowed[$mime];

                $target =
                    $uploadDir .
                    DIRECTORY_SEPARATOR .
                    $filename;

                if (!move_uploaded_file(
                    $archivo['tmp_name'],
                    $target
                )) {
                    jsonResponse(
                        false,
                        "No se pudo guardar la imagen.",
                        null,
                        500,
                        ["errorCode" => "UPLOAD_ERROR"]
                    );
                }

                $imagenRuta =
                    "uploads/productos/" . $filename;
            }

            $datos = new stdClass();

            $datos->nombreProducto = $nombreProducto;
            $datos->codigoSKU = $codigoSKU;
            $datos->stock = $stock;
            $datos->precioUnitario = $precioUnitario;
            $datos->precioCompra = $precioCompra;
            $datos->categoria = $categoria;
            $datos->fechaVencimiento = $fechaVencimiento;
            $datos->descripcion = $descripcion;
            $datos->idProveedor = $idProveedor;
            $datos->imagen = $imagenRuta;

        } else {

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

        $id = intval($_GET['id'] ?? 0);

        if ($id <= 0) {
            jsonResponse(
                false,
                "ID requerido.",
                null,
                400,
                ["errorCode" => "VALIDATION_ERROR"]
            );
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

        jsonResponse(
            false,
            "Método no permitido.",
            null,
            405,
            ["errorCode" => "METHOD_NOT_ALLOWED"]
        );

        break;
}