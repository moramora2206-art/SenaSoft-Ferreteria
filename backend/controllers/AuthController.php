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
        $password = (string)$datos->password;

        if (strlen($password) < 6) {
            return [
                "success" => false,
                "mensaje" => "La contraseña debe tener al menos 6 caracteres.",
                "errorCode" => "INVALID_PASSWORD"
            ];
        }

        $email = isset($datos->email) ? strtolower(trim($datos->email)) : "";

        if ($email !== "" && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                "success" => false,
                "mensaje" => "El correo electrónico no es válido.",
                "errorCode" => "INVALID_EMAIL"
            ];
        }

        if ($this->usuarioModel->buscarPorUsuario($usuario)) {
            return [
                "success" => false,
                "mensaje" => "El nombre de usuario ya está registrado.",
                "errorCode" => "DUPLICATE_USERNAME"
            ];
        }

        if ($email !== "" && $this->usuarioModel->buscarPorEmail($email)) {
            return [
                "success" => false,
                "mensaje" => "El correo electrónico ya está registrado.",
                "errorCode" => "DUPLICATE_EMAIL"
            ];
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $emailDb = $email === "" ? null : $email;

        /*
         * El registro público SIEMPRE crea usuarios con rol Empleado.
         * Ignoramos cualquier "rol" enviado desde el cliente para
         * evitar escalación de privilegios hacia Administrador.
         */
        $ok = $this->usuarioModel->registrar(
            $usuario,
            $passwordHash,
            trim($datos->nombre),
            isset($datos->apellido) ? trim($datos->apellido) : "",
            $emailDb,
            isset($datos->celular) ? trim($datos->celular) : (isset($datos->nCelular) ? trim($datos->nCelular) : ""),
            "Empleado"
        );

        if ($ok === true) {
            return [
                "success" => true,
                "mensaje" => "Usuario registrado correctamente."
            ];
        }

        if (is_string($ok)) {
            return [
                "success" => false,
                "mensaje" => $ok === "DUPLICATE_EMAIL"
                    ? "El correo electrónico ya está registrado."
                    : "El nombre de usuario ya está registrado.",
                "errorCode" => $ok
            ];
        }

        return [
            "success" => false,
            "mensaje" => "No fue posible registrar el usuario.",
            "errorCode" => "DATABASE_ERROR"
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
