<?php

class Cliente
{
    private $conn;

    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    public function listar($busqueda = "")
    {
        $sql = "SELECT IdCliente as idCliente, Nombre as nombre, Apellido as apellido, `Cédula` as cedula, NCelular as nCelular, Email as email, `Dirección` as direccion FROM clientes";
        
        if (!empty($busqueda)) {
            $sql .= " WHERE Nombre LIKE ? OR Apellido LIKE ? OR `Cédula` LIKE ? OR Email LIKE ?";
        }
        
        $sql .= " ORDER BY Nombre ASC";

        $stmt = $this->conn->prepare($sql);

        if (!empty($busqueda)) {
            $term = "%" . $busqueda . "%";
            $stmt->bind_param("ssss", $term, $term, $term, $term);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $clientes = [];
        while ($row = $result->fetch_assoc()) {
            $clientes[] = $row;
        }

        return $clientes;
    }

    public function buscarPorId($id)
    {
        $sql = "SELECT IdCliente as idCliente, Nombre as nombre, Apellido as apellido, `Cédula` as cedula, NCelular as nCelular, Email as email, `Dirección` as direccion FROM clientes WHERE IdCliente = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function crear($nombre, $apellido, $cedula, $nCelular, $email, $direccion)
    {
        $sql = "INSERT INTO clientes (Nombre, Apellido, `Cédula`, NCelular, Email, `Dirección`) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssss", $nombre, $apellido, $cedula, $nCelular, $email, $direccion);
        return $stmt->execute();
    }

    public function actualizar($id, $nombre, $apellido, $cedula, $nCelular, $email, $direccion)
    {
        $sql = "UPDATE clientes SET Nombre=?, Apellido=?, `Cédula`=?, NCelular=?, Email=?, `Dirección`=? WHERE IdCliente=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssssi", $nombre, $apellido, $cedula, $nCelular, $email, $direccion, $id);
        return $stmt->execute();
    }

    public function eliminar($id)
    {
        $sql = "DELETE FROM clientes WHERE IdCliente = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
