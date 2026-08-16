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
        if (intval($id) <= 0) {
            return [
                "success" => false,
                "errorCode" => "INVALID_ID",
                "message" => "ID de cliente inválido."
            ];
        }

        $cliente = $this->model->buscarPorId(intval($id));
        if (!$cliente) {
            return [
                "success" => false,
                "errorCode" => "NOT_FOUND",
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
        if (!is_object($datos)) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Datos inválidos."
            ];
        }

        $nombre = isset($datos->nombre) ? trim($datos->nombre) : "";
        $apellido = isset($datos->apellido) ? trim($datos->apellido) : "";
        $cedula = isset($datos->cedula) ? trim($datos->cedula) : "";
        $nCelular = isset($datos->nCelular) ? trim($datos->nCelular) : "";
        $email = isset($datos->email) ? strtolower(trim($datos->email)) : "";
        $direccion = isset($datos->direccion) ? trim($datos->direccion) : "";

        if ($nombre === "" || $cedula === "") {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Nombre y Cédula/NIT son requeridos."
            ];
        }

        if ($email !== "" && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                "success" => false,
                "errorCode" => "INVALID_EMAIL",
                "message" => "El correo electrónico no es válido."
            ];
        }

        if ($this->model->buscarPorCedula($cedula)) {
            return [
                "success" => false,
                "errorCode" => "DUPLICATE_CEDULA",
                "message" => "La cédula o NIT ya está registrado."
            ];
        }

        $resultado = $this->model->crear($nombre, $apellido, $cedula, $nCelular, $email, $direccion);

        if ($resultado === true) {
            return [
                "success" => true,
                "message" => "Cliente registrado exitosamente."
            ];
        }

        if (is_string($resultado)) {
            return $this->respuestaPorErrorModelo($resultado, "registrar el cliente");
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible registrar el cliente. Inténtalo nuevamente."
        ];
    }

    public function actualizar($datos)
    {
        $id = isset($datos->idCliente) ? intval($datos->idCliente) : 0;
        if ($id <= 0) {
            return [
                "success" => false,
                "errorCode" => "INVALID_ID",
                "message" => "ID de cliente inválido."
            ];
        }

        $nombre = isset($datos->nombre) ? trim($datos->nombre) : "";
        $apellido = isset($datos->apellido) ? trim($datos->apellido) : "";
        $cedula = isset($datos->cedula) ? trim($datos->cedula) : "";
        $nCelular = isset($datos->nCelular) ? trim($datos->nCelular) : "";
        $email = isset($datos->email) ? strtolower(trim($datos->email)) : "";
        $direccion = isset($datos->direccion) ? trim($datos->direccion) : "";

        if ($nombre === "" || $cedula === "") {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Nombre y Cédula/NIT son requeridos."
            ];
        }

        if ($email !== "" && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                "success" => false,
                "errorCode" => "INVALID_EMAIL",
                "message" => "El correo electrónico no es válido."
            ];
        }

        $existente = $this->model->buscarPorCedula($cedula);
        if ($existente && intval($existente['idCliente']) !== $id) {
            return [
                "success" => false,
                "errorCode" => "DUPLICATE_CEDULA",
                "message" => "La cédula o NIT ya está registrado."
            ];
        }

        $resultado = $this->model->actualizar($id, $nombre, $apellido, $cedula, $nCelular, $email, $direccion);

        if ($resultado === true) {
            return [
                "success" => true,
                "message" => "Cliente actualizado con éxito."
            ];
        }

        if (is_string($resultado)) {
            return $this->respuestaPorErrorModelo($resultado, "actualizar el cliente");
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible actualizar el cliente. Inténtalo nuevamente."
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
                "message" => "Cliente eliminado correctamente."
            ];
        }

        if (is_string($resultado)) {
            return $this->respuestaPorErrorModelo($resultado, "eliminar el cliente");
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible eliminar el cliente. Inténtalo nuevamente."
        ];
    }

    private function respuestaPorErrorModelo($errorCode, $accion)
    {
        if ($errorCode === 'DUPLICATE_CEDULA') {
            return [
                "success" => false,
                "errorCode" => $errorCode,
                "message" => "La cédula o NIT ya está registrado."
            ];
        }

        if ($errorCode === 'FOREIGN_KEY_CONSTRAINT') {
            return [
                "success" => false,
                "errorCode" => $errorCode,
                "message" => "No se puede " . $accion . " porque tiene facturas u otros registros asociados."
            ];
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible " . $accion . ". Inténtalo nuevamente."
        ];
    }
}
