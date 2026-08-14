<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../controllers/ProductoController.php");

$controller = new ProductoController($conn);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
<<<<<<< HEAD

    case 'GET':

        if (isset($_GET['id']) && intval($_GET['id']) > 0) {

            $id = intval($_GET['id']);

            $res = $controller->buscarPorId($id);

            if ($res["success"]) {
                jsonResponse(
                    true,
                    "Producto encontrado.",
                    $res["data"],
                    200
                );
            }

            jsonResponse(
                false,
                $res["message"] ?? "Producto no encontrado.",
                null,
                404
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
            $stock = intval($_POST['stock'] ?? 0);
            $precioUnitario = floatval($_POST['precioUnitario'] ?? 0);
            $precioCompra = isset($_POST['precioCompra'])
                ? floatval($_POST['precioCompra'])
                : null;

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
                        400
                    );
                }

                $finfo = new finfo(FILEINFO_MIME_TYPE);
                $mime = $finfo->file($archivo['tmp_name']);

                $allowed = [
                    'image/jpeg' => 'jpg',
                    'image/png'  => 'png',
                    'image/webp' => 'webp'
                ];

                if (!isset($allowed[$mime])) {
                    jsonResponse(
                        false,
                        "Tipo de imagen no permitido.",
                        null,
                        400
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
                        500
                    );
                }

                $imagenRuta =
                    "uploads/productos/" . $filename;
            }

            $datos = new stdClass();

=======
    case 'GET':
        if (isset($_GET['id']) && !empty($_GET['id'])) {
            $res = $controller->buscarPorId(intval($_GET['id']));
            jsonResponse($res["success"], $res["message"] ?? "", $res["data"] ?? null, $res["success"] ? 200 : 404);
        } else {
            $res = $controller->listar($_GET);
            jsonResponse($res["success"], "Lista de productos", $res["data"]);
        }
        break;

    case 'POST':
        // Soportar multipart/form-data (con imagen) y application/json
        $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
        $datos = null;

        if (stripos($contentType, 'multipart/form-data') !== false || !empty($_FILES)) {
            // Campos desde form-data
            $nombreProducto = isset($_POST['nombreProducto']) ? trim($_POST['nombreProducto']) : '';
            $codigoSKU = isset($_POST['codigoSKU']) ? trim($_POST['codigoSKU']) : '';
            $stock = isset($_POST['stock']) ? intval($_POST['stock']) : 0;
            $precioUnitario = isset($_POST['precioUnitario']) ? floatval($_POST['precioUnitario']) : 0.0;
            $precioCompra = isset($_POST['precioCompra']) ? floatval($_POST['precioCompra']) : null;
            $categoria = isset($_POST['categoria']) ? trim($_POST['categoria']) : 'General';
            $fechaVencimiento = isset($_POST['fechaVencimiento']) ? trim($_POST['fechaVencimiento']) : '';
            $descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : '';
            $idProveedor = isset($_POST['idProveedor']) ? intval($_POST['idProveedor']) : null;

            $imagenRuta = null;
            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                // Validaciones (tamaño y mime)
                $archivo = $_FILES['imagen'];
                $maxSize = 5 * 1024 * 1024; // 5MB
                if ($archivo['size'] > $maxSize) {
                    jsonResponse(false, 'El archivo excede el tamaño máximo de 5 MB', null, 400);
                }
                $finfo = new finfo(FILEINFO_MIME_TYPE);
                $mime = $finfo->file($archivo['tmp_name']);
                $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
                if (!array_key_exists($mime, $allowed)) {
                    jsonResponse(false, 'Tipo de archivo no permitido', null, 400);
                }

                $uploadDir = realpath(dirname(__DIR__, 1)) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'productos';
                if (!is_dir($uploadDir)) {
                    if (!mkdir($uploadDir, 0755, true)) {
                        jsonResponse(false, 'No se pudo crear la carpeta de uploads', null, 500);
                    }
                }

                $ext = $allowed[$mime];
                try {
                    $baseName = bin2hex(random_bytes(8));
                } catch (Exception $e) {
                    $baseName = time() . '_' . bin2hex(openssl_random_pseudo_bytes(6));
                }
                $filename = $baseName . '.' . $ext;
                $target = $uploadDir . DIRECTORY_SEPARATOR . $filename;

                if (!move_uploaded_file($archivo['tmp_name'], $target)) {
                    jsonResponse(false, 'No se pudo guardar la imagen', null, 500);
                }

                $imagenRuta = 'uploads/productos/' . $filename;
            }

            $datos = new stdClass();
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
            $datos->nombreProducto = $nombreProducto;
            $datos->codigoSKU = $codigoSKU;
            $datos->stock = $stock;
            $datos->precioUnitario = $precioUnitario;
            $datos->precioCompra = $precioCompra;
            $datos->categoria = $categoria;
            $datos->fechaVencimiento = $fechaVencimiento;
            $datos->descripcion = $descripcion;
            $datos->idProveedor = $idProveedor;
<<<<<<< HEAD
            $datos->imagen = $imagenRuta;

        } else {

            $datos = json_decode(
                file_get_contents("php://input")
            );

            if (!$datos) {
                jsonResponse(
                    false,
                    "Datos inválidos.",
                    null,
                    400
                );
=======
            if ($imagenRuta) $datos->imagen = $imagenRuta;

        } else {
            // JSON body
            $datos = json_decode(file_get_contents("php://input"));
            if (!$datos) {
                jsonResponse(false, "Datos inválidos", null, 400);
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
            }
        }

        $res = $controller->guardar($datos);
<<<<<<< HEAD

        jsonResponse(
            $res["success"],
            $res["message"],
            null,
            $res["success"] ? 201 : 400
        );

        break;


    case 'PUT':

        $datos = json_decode(
            file_get_contents("php://input")
        );

        if (!$datos) {
            jsonResponse(
                false,
                "Datos inválidos.",
                null,
                400
            );
        }

        $res = $controller->actualizar($datos);

        jsonResponse(
            $res["success"],
            $res["message"],
            null,
            $res["success"] ? 200 : 400
        );

        break;


    case 'DELETE':

        $id = intval($_GET['id'] ?? 0);

        if ($id <= 0) {
            jsonResponse(
                false,
                "ID requerido.",
                null,
                400
            );
        }

        $res = $controller->eliminar($id);

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
        jsonResponse($res["success"], $res["message"], null, $res["success"] ? 201 : 400);
        break;

    case 'PUT':
        // Mantener PUT como JSON para editar
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
