<?php

require_once(__DIR__ . "/../../config/database.php");
require_once(__DIR__ . "/../../models/Producto.php");

// Este endpoint registra una entrada de stock para un producto existente.
// Espera JSON: { "idProducto": 123, "cantidad": 10 }

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') {
    jsonResponse(false, 'Método no permitido', null, 405);
}

$datos = json_decode(file_get_contents('php://input'));
if (!$datos) {
    jsonResponse(false, 'Datos inválidos', null, 400);
}

$idProducto = isset($datos->idProducto) ? $datos->idProducto : null;
$cantidad = isset($datos->cantidad) ? $datos->cantidad : null;

if (empty($idProducto) || !is_numeric($idProducto) || intval($idProducto) <= 0) {
    jsonResponse(false, 'El producto es obligatorio', null, 400);
}

if (!isset($cantidad) || !is_numeric($cantidad) || intval($cantidad) <= 0) {
    jsonResponse(false, 'Cantidad inválida. Debe ser un entero mayor que 0', null, 400);
}

$idProducto = intval($idProducto);
$cantidad = intval($cantidad);

$model = new Producto($conn);
$res = $model->entradaStock($idProducto, $cantidad);

if (isset($res['success']) && $res['success']) {
    jsonResponse(true, 'Entrada de stock registrada correctamente', $res, 200);
}

jsonResponse(false, $res['message'] ?? 'Error al registrar la entrada de stock', null, 400);
