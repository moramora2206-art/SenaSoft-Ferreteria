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
        if (!is_object($datos)) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Datos inválidos."
            ];
        }

        $usuario = isset($datos->usuario) ? trim($datos->usuario) : "";
        $password = isset($datos->password) ? (string)$datos->password : "";
        $nombre = isset($datos->nombre) ? trim($datos->nombre) : "";
        $apellido = isset($datos->apellido) ? trim($datos->apellido) : "";
        $email = isset($datos->email) ? strtolower(trim($datos->email)) : "";
        $celular = isset($datos->nCelular) ? trim($datos->nCelular) : (isset($datos->celular) ? trim($datos->celular) : "");
        $rol = isset($datos->rol) ? trim($datos->rol) : "Empleado";

        if (!in_array($rol, ["Administrador", "Empleado"], true)) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Rol inválido."
            ];
        }

        if ($usuario === "" || $password === "" || $nombre === "") {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Completa los campos obligatorios: usuario, contraseña y nombre."
            ];
        }

        if (strlen($password) < 6) {
            return [
                "success" => false,
                "errorCode" => "INVALID_PASSWORD",
                "message" => "La contraseña debe tener al menos 6 caracteres."
            ];
        }

        if ($email !== "" && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                "success" => false,
                "errorCode" => "INVALID_EMAIL",
                "message" => "El correo electrónico no es válido."
            ];
        }

        $existente = $this->model->buscarPorUsuario($usuario);
        if ($existente) {
            return [
                "success" => false,
                "errorCode" => "DUPLICATE_USERNAME",
                "message" => "El nombre de usuario ya está registrado."
            ];
        }

        if ($email !== "") {
            $existenteEmail = $this->model->buscarPorEmail($email);
            if ($existenteEmail) {
                return [
                    "success" => false,
                    "errorCode" => "DUPLICATE_EMAIL",
                    "message" => "El correo electrónico ya está registrado."
                ];
            }
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $emailDb = $email === "" ? null : $email;

        $resultado = $this->model->registrar($usuario, $passwordHash, $nombre, $apellido, $emailDb, $celular, $rol);

        if ($resultado === true) {
            return [
                "success" => true,
                "message" => "Usuario registrado correctamente."
            ];
        }

        if (is_string($resultado)) {
            return [
                "success" => false,
                "errorCode" => $resultado,
                "message" => $resultado === "DUPLICATE_EMAIL"
                    ? "El correo electrónico ya está registrado."
                    : "El nombre de usuario ya está registrado."
            ];
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible registrar el usuario. Inténtalo nuevamente."
        ];
    }

    public function actualizar($datos)
    {
        $id = isset($datos->idUsuario) ? intval($datos->idUsuario) : 0;
        if ($id <= 0) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "ID de usuario inválido."
            ];
        }

        $usuario = isset($datos->usuario) ? trim($datos->usuario) : "";
        $nombre = isset($datos->nombre) ? trim($datos->nombre) : "";
        $apellido = isset($datos->apellido) ? trim($datos->apellido) : "";
        $email = isset($datos->email) ? strtolower(trim($datos->email)) : "";
        $celular = isset($datos->nCelular) ? trim($datos->nCelular) : (isset($datos->celular) ? trim($datos->celular) : "");
        $rol = isset($datos->rol) ? trim($datos->rol) : "Empleado";

        if (!in_array($rol, ["Administrador", "Empleado"], true)) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Rol inválido."
            ];
        }

        if ($usuario === "" || $nombre === "") {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Usuario y nombre son requeridos."
            ];
        }

        $existente = $this->model->buscarPorId($id);

        if (!$existente) {
            return [
                "success" => false,
                "errorCode" => "NOT_FOUND",
                "message" => "Usuario no encontrado."
            ];
        }

        if (
            ($existente["rol"] ?? "") === "Administrador"
            && $rol !== "Administrador"
        ) {
            $admins = $this->model->contarAdministradores();

            if ($admins <= 1) {
                return [
                    "success" => false,
                    "errorCode" => "VALIDATION_ERROR",
                    "message" => "No puedes quitar el rol Administrador al último administrador del sistema."
                ];
            }
        }

        if ($email !== "" && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                "success" => false,
                "errorCode" => "INVALID_EMAIL",
                "message" => "El correo electrónico no es válido."
            ];
        }

        $existente = $this->model->buscarPorUsuario($usuario);
        if ($existente && intval($existente['idUsuario']) !== $id) {
            return [
                "success" => false,
                "errorCode" => "DUPLICATE_USERNAME",
                "message" => "El nombre de usuario ya está registrado."
            ];
        }

        if ($email !== "") {
            $existenteEmail = $this->model->buscarPorEmail($email);
            if ($existenteEmail && intval($existenteEmail['idUsuario']) !== $id) {
                return [
                    "success" => false,
                    "errorCode" => "DUPLICATE_EMAIL",
                    "message" => "El correo electrónico ya está registrado."
                ];
            }
        }

        $passwordHash = null;
        if (!empty($datos->password)) {
            $password = (string)$datos->password;

            if (strlen($password) < 6) {
                return [
                    "success" => false,
                    "errorCode" => "INVALID_PASSWORD",
                    "message" => "La contraseña debe tener al menos 6 caracteres."
                ];
            }

            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        }

        $emailDb = $email === "" ? null : $email;

        $resultado = $this->model->actualizar($id, $usuario, $nombre, $apellido, $emailDb, $celular, $rol, $passwordHash);

        if ($resultado === true) {
            return [
                "success" => true,
                "message" => "Usuario actualizado correctamente."
            ];
        }

        if (is_string($resultado)) {
            return [
                "success" => false,
                "errorCode" => $resultado,
                "message" => $resultado === "DUPLICATE_EMAIL"
                    ? "El correo electrónico ya está registrado."
                    : "El nombre de usuario ya está registrado."
            ];
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No se pudo actualizar el usuario."
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

        $usuarioActual = isset($_SESSION["idUsuario"]) ? intval($_SESSION["idUsuario"]) : 0;

        if ($usuarioActual > 0 && $usuarioActual === $id) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "No puedes eliminar tu propio usuario."
            ];
        }

        $target = $this->model->buscarPorId($id);
        if (!$target) {
            return [
                "success" => false,
                "errorCode" => "NOT_FOUND",
                "message" => "Usuario no encontrado."
            ];
        }

        if (($target["rol"] ?? "") === "Administrador") {
            $admins = $this->model->contarAdministradores();
            if ($admins <= 1) {
                return [
                    "success" => false,
                    "errorCode" => "VALIDATION_ERROR",
                    "message" => "No puedes eliminar al último administrador del sistema."
                ];
            }
        }

        $resultado = $this->model->eliminar($id);

        if ($resultado === true) {
            return [
                "success" => true,
                "message" => "Usuario eliminado con éxito."
            ];
        }

        if ($resultado === 'FOREIGN_KEY_CONSTRAINT') {
            return [
                "success" => false,
                "errorCode" => "FOREIGN_KEY_CONSTRAINT",
                "message" => "No se puede eliminar el usuario porque tiene facturas u otros registros asociados."
            ];
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No se pudo eliminar el usuario."
        ];
    }
}
