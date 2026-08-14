<?php

require_once(__DIR__ . "/../models/Usuario.php");

class AuthController
{
    private $usuarioModel;

    public function __construct($conexion)
    {
        $this->usuarioModel = new Usuario($conexion);
    }

    public function registrar($datos)
    {
        if (
            !$datos ||
            empty($datos->usuario) ||
            empty($datos->password) ||
            empty($datos->nombre)
        ) {
            return [
                "success" => false,
                "mensaje" => "Usuario, contraseña y nombre son requeridos.",
                "errorCode" => "VALIDATION_ERROR"
            ];
        }

        $usuario = trim($datos->usuario);

        if ($this->usuarioModel->buscarPorUsuario($usuario)) {
            return [
                "success" => false,
                "mensaje" => "El usuario ya existe.",
                "errorCode" => "USER_ALREADY_EXISTS"
            ];
        }

        $passwordHash = password_hash($datos->password, PASSWORD_DEFAULT);

        $ok = $this->usuarioModel->registrar(
            $usuario,
            $passwordHash,
            trim($datos->nombre),
            isset($datos->apellido) ? trim($datos->apellido) : "",
            isset($datos->email) ? trim($datos->email) : "",
            isset($datos->celular) ? trim($datos->celular) : (isset($datos->nCelular) ? trim($datos->nCelular) : ""),
            isset($datos->rol) ? trim($datos->rol) : "Empleado"
        );

        if ($ok) {
            return [
                "success" => true,
                "mensaje" => "Usuario registrado correctamente."
            ];
        }

        return [
            "success" => false,
            "mensaje" => "No fue posible registrar el usuario.",
            "errorCode" => "USER_CREATE_FAILED"
        ];
    }

    public function login($datos)
    {
        $usuarioNombre = isset($datos->usuario) ? trim($datos->usuario) : "";
        $passwordIngresado = isset($datos->password) ? (string) $datos->password : "";

        if ($usuarioNombre === "" || $passwordIngresado === "") {
            return [
                "success" => false,
                "mensaje" => "Usuario y contraseña son requeridos.",
                "status" => 400,
                "errorCode" => "VALIDATION_ERROR"
            ];
        }

        $usuario = $this->usuarioModel->buscarPorUsuario($usuarioNombre);

        if (!$usuario) {
            return [
                "success" => false,
                "mensaje" => "Usuario o contraseña incorrectos.",
                "status" => 401,
                "errorCode" => "INVALID_CREDENTIALS"
            ];
        }

        $hashAlmacenado = $usuario["passwordHash"] ?? "";

        if ($hashAlmacenado === "" || !password_verify($passwordIngresado, $hashAlmacenado)) {
            return [
                "success" => false,
                "mensaje" => "Usuario o contraseña incorrectos.",
                "status" => 401,
                "errorCode" => "INVALID_CREDENTIALS"
            ];
        }

        if (password_needs_rehash($hashAlmacenado, PASSWORD_DEFAULT)) {
            error_log("El hash del usuario {$usuarioNombre} requiere rehash.");
        }

        return [
            "success" => true,
            "mensaje" => "Autenticación satisfactoria.",
            "usuario" => [
                "idUsuario" => intval($usuario["idUsuario"]),
                "usuario" => $usuario["usuario"],
                "nombre" => $usuario["nombre"],
                "apellido" => $usuario["apellido"],
                "email" => $usuario["email"],
                "nCelular" => $usuario["nCelular"],
                "rol" => $usuario["rol"]
            ]
        ];
    }
}
