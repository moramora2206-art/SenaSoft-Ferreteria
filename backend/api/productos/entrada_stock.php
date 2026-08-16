<?php

require_once(__DIR__ . "/../../config/database.php");
require_once(__DIR__ . "/../../config/auth.php");
require_once(__DIR__ . "/../../models/Producto.php");

// Este endpoint registra una entrada de stock para un producto existente.
// Espera JSON: { "idProducto": 123, "cantidad": 10 }

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') {
    jsonResponse(false, 'Método no permitido', null, 405, ["errorCode" => "METHOD_NOT_ALLOWED"]);
}

requerirUsuario();

$datos = json_decode(file_get_contents('php://input'));
if (json_last_error() !== JSON_ERROR_NONE || !$datos) {
    jsonResponse(false, 'JSON inválido', null, 400, ["errorCode" => "INVALID_JSON"]);
}

$idProducto = isset($datos->idProducto) ? $datos->idProducto : null;
$cantidad = isset($datos->cantidad) ? $datos->cantidad : null;

if (empty($idProducto) || !esEntero($idProducto) || intval($idProducto) <= 0) {
    jsonResponse(false, 'El producto es obligatorio', null, 400, ["errorCode" => "VALIDATION_ERROR"]);
}

if (!isset($cantidad) || !esEntero($cantidad)) {
    jsonResponse(false, 'Cantidad inválida. Debe ser un número entero mayor que 0', null, 400, ["errorCode" => "VALIDATION_ERROR"]);
}

$idProducto = intval($idProducto);
$cantidad = intval($cantidad);

if ($cantidad <= 0) {
    jsonResponse(false, 'Cantidad inválida. Debe ser un número entero mayor que 0', null, 400, ["errorCode" => "VALIDATION_ERROR"]);
}

$model = new Producto($conn);
$res = $model->entradaStock($idProducto, $cantidad);

if (isset($res['success']) && $res['success']) {
    jsonResponse(true, 'Entrada de stock registrada correctamente', $res, 200);
}

$code = isset($res['errorCode'])
    ? codigoHttpParaError($res['errorCode'])
    : 400;

jsonResponse(false, $res['message'] ?? 'Error al registrar la entrada de stock', null, $code, isset($res['errorCode']) ? ["errorCode" => $res['errorCode']] : []);