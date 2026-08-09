<?php

require_once("../models/Usuario.php");

class AuthController
{
    private $usuarioModel;

    public function __construct($conexion)
    {
        $this->usuarioModel = new Usuario($conexion);
    }

    // ===========================
    // REGISTRAR USUARIO
    // ===========================
    public function registrar($datos)
    {
        $usuario = $datos->usuario;

        // Verificar si el usuario ya existe
        $resultado = $this->usuarioModel->buscarPorUsuario($usuario);

        if ($resultado->num_rows > 0) {

            return [
                "success" => false,
                "mensaje" => "El usuario ya existe."
            ];
        }

        // Encriptar contraseña
        $passwordHash = password_hash($datos->password, PASSWORD_DEFAULT);

        $ok = $this->usuarioModel->registrar(
            $usuario,
            $passwordHash,
            $datos->nombre,
            $datos->apellido,
            $datos->email,
            $datos->celular,
            $datos->rol
        );

        if ($ok) {

            return [
                "success" => true,
                "mensaje" => "Usuario registrado correctamente."
            ];
        }

        return [
            "success" => false,
            "mensaje" => "No fue posible registrar el usuario."
        ];
    }

    // ===========================
    // LOGIN
    // ===========================
    public function login($datos)
    {
        $resultado = $this->usuarioModel->buscarPorUsuario($datos->usuario);

        if ($resultado->num_rows == 0) {

            return [
                "success" => false,
                "mensaje" => "Usuario no encontrado."
            ];
        }

        $usuario = $resultado->fetch_assoc();

        if (password_verify($datos->password, $usuario["Contraseña"])) {

            return [
                "success" => true,
                "mensaje" => "Autenticación satisfactoria.",
                "usuario" => [
                    "id" => $usuario["IDUsuario"],
                    "nombre" => $usuario["Nombre"],
                    "apellido" => $usuario["Apellido"],
                    "rol" => $usuario["Rol"]
                ]
            ];
        }

        return [
            "success" => false,
            "mensaje" => "Contraseña incorrecta."
        ];
    }
}