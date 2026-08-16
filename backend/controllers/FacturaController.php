<?php

require_once(__DIR__ . "/../models/Factura.php");

class FacturaController
{
    private $model;

    public function __construct($conexion)
    {
        $this->model = new Factura($conexion);
    }

    public function listar()
    {
        $facturas = $this->model->listar();
        return [
            "success" => true,
            "data" => $facturas
        ];
    }

    public function buscarPorId($id)
    {
        $id = intval($id);
        if ($id <= 0) {
            return [
                "success" => false,
                "errorCode" => "INVALID_ID",
                "message" => "ID de factura inválido."
            ];
        }

        $factura = $this->model->buscarPorId($id);

        if (!$factura) {
            return [
                "success" => false,
                "errorCode" => "NOT_FOUND",
                "message" => "Factura no encontrada."
            ];
        }
        return [
            "success" => true,
            "data" => $factura
        ];
    }

    public function guardar($datos)
    {
        if (
            empty($datos->idCliente) ||
            empty($datos->detalles) ||
            count($datos->detalles) === 0
        ) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" =>
                    "Debe seleccionar un cliente y agregar al menos un producto a la factura."
            ];
        }

        /*
         * El idUsuario ya viene de la sesión.
         */
        $idUsuario = intval($datos->idUsuario);

        if ($idUsuario <= 0) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" =>
                    "No se pudo identificar al usuario actual."
            ];
        }

        $idCliente = intval($datos->idCliente);

        $formaDePago = isset($datos->formaDePago)
            ? trim($datos->formaDePago)
            : "Efectivo";

        $descuento = isset($datos->descuento)
            ? floatval($datos->descuento)
            : 0.0;

        $observaciones = isset($datos->observaciones)
            ? trim($datos->observaciones)
            : "";

        $detalles = $datos->detalles;

        /*
         * Validación explícita de enteros: se rechaza cualquier cantidad
         * decimal (5.8) en lugar de truncarla silenciosamente con intval().
         */
        foreach ($detalles as $detalle) {
            $idProductoDetalle = isset($detalle->idProducto) ? $detalle->idProducto : null;
            $cantidadDetalle = isset($detalle->cantidad) ? $detalle->cantidad : null;

            if (!esEntero($idProductoDetalle) || intval($idProductoDetalle) <= 0) {
                return [
                    "success" => false,
                    "errorCode" => "VALIDATION_ERROR",
                    "message" => "Cada detalle debe incluir un producto válido."
                ];
            }

            if (!esEntero($cantidadDetalle) || intval($cantidadDetalle) <= 0) {
                return [
                    "success" => false,
                    "errorCode" => "VALIDATION_ERROR",
                    "message" => "La cantidad de cada producto debe ser un número entero mayor que 0."
                ];
            }
        }

        $resultado = $this->model->crear(
            $idUsuario,
            $idCliente,
            $formaDePago,
            $descuento,
            $observaciones,
            $detalles
        );

        if ($resultado["success"]) {
            return [
                "success" => true,
                "message" =>
                    "Factura registrada exitosamente y stock descontado del inventario.",
                "facturaId" =>
                    $resultado["facturaId"],
                "total" =>
                    $resultado["total"]
            ];
        }

        return [
            "success" => false,
            "errorCode" =>
                isset($resultado["errorCode"])
                    ? $resultado["errorCode"]
                    : "DATABASE_ERROR",
            "message" =>
                $resultado["error"]
        ];
    }

    /*
     * ANULAR FACTURA
     */
    public function anular($id)
    {
        $id = intval($id);

        if ($id <= 0) {
            return [
                "success" => false,
                "errorCode" => "INVALID_ID",
                "message" => "ID inválido."
            ];
        }

        $resultado = $this->model->anular($id);

        if ($resultado["success"]) {
            return [
                "success" => true,
                "message" =>
                    "Factura anulada correctamente. El stock fue devuelto al inventario."
            ];
        }

        return [
            "success" => false,
            "errorCode" =>
                isset($resultado["errorCode"])
                    ? $resultado["errorCode"]
                    : "DATABASE_ERROR",
            "message" =>
                $resultado["error"]
        ];
    }
}