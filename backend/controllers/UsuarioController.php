<?php

require_once(__DIR__ . "/../models/Usuario.php");

class UsuarioController
{
    private $model;

    public function __construct($conexion)
    {
        $this->model = new Usuario($conexion);
    }

    public function listar()
    {
        $usuarios = $this->model->listar();
        return [
            "success" => true,
            "data" => $usuarios
        ];
    }

    public function buscarPorId($id)
    {
        $usuario = $this->model->buscarPorId($id);
        if (!$usuario) {
            return [
                "success" => false,
                "message" => "Usuario no encontrado."
            ];
        }
        return [
            "success" => true,
            "data" => $usuario
        ];
    }

    public function guardar($datos)
    {
        if (empty($datos->usuario) || empty($datos->password) || empty($datos->nombre)) {
            return [
                "success" => false,
                "message" => "Usuario, contraseña y nombre son requeridos."
            ];
        }

        $usuario = trim($datos->usuario);
        
        $existente = $this->model->buscarPorUsuario($usuario);
        if ($existente->num_rows > 0) {
            return [
                "success" => false,
                "message" => "El nombre de usuario ya se encuentra registrado."
            ];
        }

        $passwordHash = password_hash($datos->password, PASSWORD_DEFAULT);
        $nombre = trim($datos->nombre);
        $apellido = isset($datos->apellido) ? trim($datos->apellido) : "";
        $email = isset($datos->email) ? trim($datos->email) : "";
        $celular = isset($datos->nCelular) ? trim($datos->nCelular) : (isset($datos->celular) ? trim($datos->celular) : "");
        $rol = isset($datos->rol) ? trim($datos->rol) : "Empleado";

        $ok = $this->model->registrar($usuario, $passwordHash, $nombre, $apellido, $email, $celular, $rol);

        if ($ok) {
            return [
                "success" => true,
                "message" => "Usuario creado exitosamente."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo registrar el usuario."
        ];
    }

    public function actualizar($datos)
    {
        $id = isset($datos->idUsuario) ? intval($datos->idUsuario) : 0;
        if ($id <= 0) {
            return [
                "success" => false,
                "message" => "ID de usuario inválido."
            ];
        }

        $usuario = trim($datos->usuario);
        $nombre = trim($datos->nombre);
        $apellido = isset($datos->apellido) ? trim($datos->apellido) : "";
        $email = isset($datos->email) ? trim($datos->email) : "";
        $celular = isset($datos->nCelular) ? trim($datos->nCelular) : (isset($datos->celular) ? trim($datos->celular) : "");
        $rol = isset($datos->rol) ? trim($datos->rol) : "Empleado";

        $passwordHash = null;
        if (!empty($datos->password)) {
            $passwordHash = password_hash($datos->password, PASSWORD_DEFAULT);
        }

        $ok = $this->model->actualizar($id, $usuario, $nombre, $apellido, $email, $celular, $rol, $passwordHash);

        if ($ok) {
            return [
                "success" => true,
                "message" => "Usuario actualizado correctamente."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo actualizar el usuario."
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
                "message" => "Usuario eliminado con éxito."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo eliminar el usuario."
        ];
    }
}
