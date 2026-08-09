<?php

class Usuario
{
    private $conn;

    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    public function buscarPorUsuario($usuario)
    {
        $sql = "SELECT * FROM usuarios WHERE Usuario = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        return $stmt->get_result();
    }

    public function buscarPorId($id)
    {
        $sql = "SELECT IdUsuario as idUsuario, Usuario as usuario, Nombre as nombre, Apellido as apellido, Email as email, NCelular as nCelular, Rol as rol FROM usuarios WHERE IdUsuario = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function registrar($usuario, $password, $nombre, $apellido, $email, $celular, $rol)
    {
        $sql = "INSERT INTO usuarios (Usuario, Contraseña, Nombre, Apellido, Email, NCelular, Rol) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssssss", $usuario, $password, $nombre, $apellido, $email, $celular, $rol);
        return $stmt->execute();
    }

    public function listar()
    {
        $sql = "SELECT IdUsuario as idUsuario, Usuario as usuario, Nombre as nombre, Apellido as apellido, Email as email, NCelular as nCelular, Rol as rol FROM usuarios ORDER BY Nombre ASC";
        $result = $this->conn->query($sql);
        $usuarios = [];
        while ($row = $result->fetch_assoc()) {
            $usuarios[] = $row;
        }
        return $usuarios;
    }

    public function actualizar($id, $usuario, $nombre, $apellido, $email, $celular, $rol, $password = null)
    {
        if ($password) {
            $sql = "UPDATE usuarios SET Usuario=?, Contraseña=?, Nombre=?, Apellido=?, Email=?, NCelular=?, Rol=? WHERE IdUsuario=?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("sssssssi", $usuario, $password, $nombre, $apellido, $email, $celular, $rol, $id);
        } else {
            $sql = "UPDATE usuarios SET Usuario=?, Nombre=?, Apellido=?, Email=?, NCelular=?, Rol=? WHERE IdUsuario=?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("ssssssi", $usuario, $nombre, $apellido, $email, $celular, $rol, $id);
        }
        return $stmt->execute();
    }

    public function eliminar($id)
    {
        $sql = "DELETE FROM usuarios WHERE IdUsuario = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}