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
<<<<<<< HEAD

=======
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        return [
            "success" => true,
            "data" => $facturas
        ];
    }

    public function buscarPorId($id)
    {
        $factura = $this->model->buscarPorId($id);
<<<<<<< HEAD

        if (!$factura) {

=======
        if (!$factura) {
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
            return [
                "success" => false,
                "message" => "Factura no encontrada."
            ];
        }
<<<<<<< HEAD

=======
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        return [
            "success" => true,
            "data" => $factura
        ];
    }

    public function guardar($datos)
    {
<<<<<<< HEAD
        if (
            empty($datos->idCliente) ||
            empty($datos->detalles) ||
            count($datos->detalles) === 0
        ) {

            return [
                "success" => false,
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
=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
            ];
        }

        return [
            "success" => false,
<<<<<<< HEAD
            "message" =>
                "Error al registrar la factura: " .
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

=======
            "message" => "Error al registrar la factura: " . $resultado["error"]
        ];
    }

    public function eliminar($id)
    {
        $id = intval($id);
        if ($id <= 0) {
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
            return [
                "success" => false,
                "message" => "ID inválido."
            ];
        }

<<<<<<< HEAD
        $resultado = $this->model->anular($id);

        if ($resultado["success"]) {

            return [
                "success" => true,
                "message" =>
                    "Factura anulada correctamente. El stock fue devuelto al inventario."
=======
        $ok = $this->model->eliminar($id);
        if ($ok) {
            return [
                "success" => true,
                "message" => "Factura eliminada correctamente."
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
            ];
        }

        return [
            "success" => false,
<<<<<<< HEAD
            "message" =>
                "No se pudo anular la factura: " .
                ($resultado["error"] ?? "")
        ];
    }
}
=======
            "message" => "No se pudo eliminar la factura."
        ];
    }
}
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
