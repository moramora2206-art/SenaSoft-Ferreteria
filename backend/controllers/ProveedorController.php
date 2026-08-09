<?php

require_once(__DIR__ . "/../models/Proveedor.php");

class ProveedorController
{
    private $model;

    public function __construct($conexion)
    {
        $this->model = new Proveedor($conexion);
    }

    public function listar($queryParams = [])
    {
        $busqueda = isset($queryParams['busqueda']) ? trim($queryParams['busqueda']) : "";
        $proveedores = $this->model->listar($busqueda);
        return [
            "success" => true,
            "data" => $proveedores
        ];
    }

    public function buscarPorId($id)
    {
        $proveedor = $this->model->buscarPorId($id);
        if (!$proveedor) {
            return [
                "success" => false,
                "message" => "Proveedor no encontrado."
            ];
        }
        return [
            "success" => true,
            "data" => $proveedor
        ];
    }

    public function guardar($datos)
    {
        if (empty($datos->nombreProveedor) || empty($datos->nit)) {
            return [
                "success" => false,
                "message" => "Nombre del proveedor y NIT son requeridos."
            ];
        }

        $nombreProveedor = trim($datos->nombreProveedor);
        $nit = intval($datos->nit);
        $nombreContacto = isset($datos->nombreContacto) ? trim($datos->nombreContacto) : "";
        $nCelular = isset($datos->nCelular) ? trim($datos->nCelular) : "";
        $email = isset($datos->email) ? trim($datos->email) : "";

        $ok = $this->model->crear($nombreProveedor, $nit, $nombreContacto, $nCelular, $email);

        if ($ok) {
            return [
                "success" => true,
                "message" => "Proveedor registrado con éxito."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo registrar el proveedor."
        ];
    }

    public function actualizar($datos)
    {
        $id = isset($datos->idProveedor) ? intval($datos->idProveedor) : 0;
        if ($id <= 0) {
            return [
                "success" => false,
                "message" => "ID de proveedor inválido."
            ];
        }

        $nombreProveedor = trim($datos->nombreProveedor);
        $nit = intval($datos->nit);
        $nombreContacto = isset($datos->nombreContacto) ? trim($datos->nombreContacto) : "";
        $nCelular = isset($datos->nCelular) ? trim($datos->nCelular) : "";
        $email = isset($datos->email) ? trim($datos->email) : "";

        $ok = $this->model->actualizar($id, $nombreProveedor, $nit, $nombreContacto, $nCelular, $email);

        if ($ok) {
            return [
                "success" => true,
                "message" => "Proveedor actualizado con éxito."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo actualizar el proveedor."
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
                "message" => "Proveedor eliminado correctamente."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo eliminar el proveedor. Compruebe si tiene productos asociados."
        ];
    }
}
