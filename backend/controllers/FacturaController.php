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
        $factura = $this->model->buscarPorId($id);
        if (!$factura) {
            return [
                "success" => false,
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
        if (empty($datos->idCliente) || empty($datos->detalles) || count($datos->detalles) === 0) {
            return [
                "success" => false,
                "message" => "Debe seleccionar un cliente y agregar al menos un producto a la factura."
            ];
        }

        $idUsuario = isset($datos->idUsuario) && intval($datos->idUsuario) > 0 ? intval($datos->idUsuario) : 1;
        $idCliente = intval($datos->idCliente);
        $formaDePago = isset($datos->formaDePago) ? trim($datos->formaDePago) : "Efectivo";
        $descuento = isset($datos->descuento) ? floatval($datos->descuento) : 0.0;
        $total = isset($datos->total) ? floatval($datos->total) : 0.0;
        $observaciones = isset($datos->observaciones) ? trim($datos->observaciones) : "";
        $detalles = $datos->detalles;

        $resultado = $this->model->crear($idUsuario, $idCliente, $formaDePago, $descuento, $total, $observaciones, $detalles);

        if ($resultado["success"]) {
            return [
                "success" => true,
                "message" => "Factura registrada exitosamente y stock descontado del inventario.",
                "facturaId" => $resultado["facturaId"]
            ];
        }

        return [
            "success" => false,
            "message" => "Error al registrar la factura: " . $resultado["error"]
        ];
    }

    public function eliminar($id)
    {
        $id = intval($id);
        if ($id <= 0) {
            return [
                "success" => false,
                "message" => "ID inválido."
            ];
        }

        $ok = $this->model->eliminar($id);
        if ($ok) {
            return [
                "success" => true,
                "message" => "Factura eliminada correctamente."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo eliminar la factura."
        ];
    }
}
