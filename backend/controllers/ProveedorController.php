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
        $id = intval($id);
        if ($id <= 0) {
            return [
                "success" => false,
                "errorCode" => "INVALID_ID",
                "message" => "ID de proveedor inválido."
            ];
        }

        $proveedor = $this->model->buscarPorId($id);
        if (!$proveedor) {
            return [
                "success" => false,
                "errorCode" => "NOT_FOUND",
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
        if (!is_object($datos)) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Datos inválidos."
            ];
        }

        $nombreProveedor = isset($datos->nombreProveedor) ? trim($datos->nombreProveedor) : "";
        $nit = isset($datos->nit) ? intval($datos->nit) : 0;
        $nombreContacto = isset($datos->nombreContacto) ? trim($datos->nombreContacto) : "";
        $nCelular = isset($datos->nCelular) ? trim($datos->nCelular) : "";
        $email = isset($datos->email) ? strtolower(trim($datos->email)) : "";

        if ($nombreProveedor === "" || $nit <= 0) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Nombre del proveedor y NIT son requeridos."
            ];
        }

        if ($email !== "" && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                "success" => false,
                "errorCode" => "INVALID_EMAIL",
                "message" => "El correo electrónico no es válido."
            ];
        }

        if ($this->model->buscarPorNit($nit)) {
            return [
                "success" => false,
                "errorCode" => "DUPLICATE_NIT",
                "message" => "El NIT ya está registrado."
            ];
        }

        $resultado = $this->model->crear($nombreProveedor, $nit, $nombreContacto, $nCelular, $email);

        if ($resultado === true) {
            return [
                "success" => true,
                "message" => "Proveedor registrado con éxito."
            ];
        }

        if (is_string($resultado)) {
            return $this->respuestaPorErrorModelo($resultado, "registrar el proveedor");
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible registrar el proveedor. Inténtalo nuevamente."
        ];
    }

    public function actualizar($datos)
    {
        $id = isset($datos->idProveedor) ? intval($datos->idProveedor) : 0;
        if ($id <= 0) {
            return [
                "success" => false,
                "errorCode" => "INVALID_ID",
                "message" => "ID de proveedor inválido."
            ];
        }

        $nombreProveedor = isset($datos->nombreProveedor) ? trim($datos->nombreProveedor) : "";
        $nit = isset($datos->nit) ? intval($datos->nit) : 0;
        $nombreContacto = isset($datos->nombreContacto) ? trim($datos->nombreContacto) : "";
        $nCelular = isset($datos->nCelular) ? trim($datos->nCelular) : "";
        $email = isset($datos->email) ? strtolower(trim($datos->email)) : "";

        if ($nombreProveedor === "" || $nit <= 0) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Nombre del proveedor y NIT son requeridos."
            ];
        }

        if ($email !== "" && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                "success" => false,
                "errorCode" => "INVALID_EMAIL",
                "message" => "El correo electrónico no es válido."
            ];
        }

        $existente = $this->model->buscarPorNit($nit);
        if ($existente && intval($existente['idProveedor']) !== $id) {
            return [
                "success" => false,
                "errorCode" => "DUPLICATE_NIT",
                "message" => "El NIT ya está registrado."
            ];
        }

        $resultado = $this->model->actualizar($id, $nombreProveedor, $nit, $nombreContacto, $nCelular, $email);

        if ($resultado === true) {
            return [
                "success" => true,
                "message" => "Proveedor actualizado con éxito."
            ];
        }

        if (is_string($resultado)) {
            return $this->respuestaPorErrorModelo($resultado, "actualizar el proveedor");
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible actualizar el proveedor. Inténtalo nuevamente."
        ];
    }

    public function eliminar($id)
    {
        $id = intval($id);
        if ($id <= 0) {
            return [
                "success" => false,
                "errorCode" => "INVALID_ID",
                "message" => "ID inválido."
            ];
        }

        $resultado = $this->model->eliminar($id);

        if ($resultado === true) {
            return [
                "success" => true,
                "message" => "Proveedor eliminado correctamente."
            ];
        }

        if (is_string($resultado)) {
            return $this->respuestaPorErrorModelo($resultado, "eliminar el proveedor");
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible eliminar el proveedor. Inténtalo nuevamente."
        ];
    }

    private function respuestaPorErrorModelo($errorCode, $accion)
    {
        if ($errorCode === 'DUPLICATE_NIT') {
            return [
                "success" => false,
                "errorCode" => $errorCode,
                "message" => "El NIT ya está registrado."
            ];
        }

        if ($errorCode === 'FOREIGN_KEY_CONSTRAINT') {
            return [
                "success" => false,
                "errorCode" => $errorCode,
                "message" => "No se puede " . $accion . " porque tiene productos u otros registros asociados."
            ];
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible " . $accion . ". Inténtalo nuevamente."
        ];
    }
}