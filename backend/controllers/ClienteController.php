<?php

require_once(__DIR__ . "/../models/Cliente.php");

class ClienteController
{
    private $model;

    public function __construct($conexion)
    {
        $this->model = new Cliente($conexion);
    }

    public function listar($queryParams = [])
    {
        $busqueda = isset($queryParams['busqueda']) ? trim($queryParams['busqueda']) : "";
        $clientes = $this->model->listar($busqueda);
        return [
            "success" => true,
            "data" => $clientes
        ];
    }

    public function buscarPorId($id)
    {
        $cliente = $this->model->buscarPorId($id);
        if (!$cliente) {
            return [
                "success" => false,
                "message" => "Cliente no encontrado."
            ];
        }
        return [
            "success" => true,
            "data" => $cliente
        ];
    }

    public function guardar($datos)
    {
        if (empty($datos->nombre) || empty($datos->cedula)) {
            return [
                "success" => false,
                "message" => "Nombre y Cédula/NIT son requeridos."
            ];
        }

        $nombre = trim($datos->nombre);
        $apellido = isset($datos->apellido) ? trim($datos->apellido) : "";
        $cedula = trim($datos->cedula);
        $nCelular = isset($datos->nCelular) ? trim($datos->nCelular) : "";
        $email = isset($datos->email) ? trim($datos->email) : "";
        $direccion = isset($datos->direccion) ? trim($datos->direccion) : "";

        $ok = $this->model->crear($nombre, $apellido, $cedula, $nCelular, $email, $direccion);

        if ($ok) {
            return [
                "success" => true,
                "message" => "Cliente registrado exitosamente."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo registrar el cliente."
        ];
    }

    public function actualizar($datos)
    {
        $id = isset($datos->idCliente) ? intval($datos->idCliente) : 0;
        if ($id <= 0) {
            return [
                "success" => false,
                "message" => "ID de cliente inválido."
            ];
        }

        $nombre = trim($datos->nombre);
        $apellido = isset($datos->apellido) ? trim($datos->apellido) : "";
        $cedula = trim($datos->cedula);
        $nCelular = isset($datos->nCelular) ? trim($datos->nCelular) : "";
        $email = isset($datos->email) ? trim($datos->email) : "";
        $direccion = isset($datos->direccion) ? trim($datos->direccion) : "";

        $ok = $this->model->actualizar($id, $nombre, $apellido, $cedula, $nCelular, $email, $direccion);

        if ($ok) {
            return [
                "success" => true,
                "message" => "Cliente actualizado con éxito."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo actualizar el cliente."
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
                "message" => "Cliente eliminado correctamente."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo eliminar el cliente. Compruebe si tiene facturas asociadas."
        ];
    }
}
