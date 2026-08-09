<?php

class Proveedor
{
    private $conn;

    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    public function listar($busqueda = "")
    {
        $sql = "SELECT IdProveedor as idProveedor, Nombre_Proveedor as nombreProveedor, NIT as nit, Nombre_Contacto as nombreContacto, NCelular as nCelular, Email as email FROM proveedores";

        if (!empty($busqueda)) {
            $sql .= " WHERE Nombre_Proveedor LIKE ? OR NIT LIKE ? OR Nombre_Contacto LIKE ? OR Email LIKE ?";
        }

        $sql .= " ORDER BY Nombre_Proveedor ASC";

        $stmt = $this->conn->prepare($sql);

        if (!empty($busqueda)) {
            $term = "%" . $busqueda . "%";
            $stmt->bind_param("ssss", $term, $term, $term, $term);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $proveedores = [];
        while ($row = $result->fetch_assoc()) {
            $proveedores[] = $row;
        }

        return $proveedores;
    }

    public function buscarPorId($id)
    {
        $sql = "SELECT IdProveedor as idProveedor, Nombre_Proveedor as nombreProveedor, NIT as nit, Nombre_Contacto as nombreContacto, NCelular as nCelular, Email as email FROM proveedores WHERE IdProveedor = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function crear($nombreProveedor, $nit, $nombreContacto, $nCelular, $email)
    {
        $sql = "INSERT INTO proveedores (Nombre_Proveedor, NIT, Nombre_Contacto, NCelular, Email) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sisss", $nombreProveedor, $nit, $nombreContacto, $nCelular, $email);
        return $stmt->execute();
    }

    public function actualizar($id, $nombreProveedor, $nit, $nombreContacto, $nCelular, $email)
    {
        $sql = "UPDATE proveedores SET Nombre_Proveedor=?, NIT=?, Nombre_Contacto=?, NCelular=?, Email=? WHERE IdProveedor=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sisssi", $nombreProveedor, $nit, $nombreContacto, $nCelular, $email, $id);
        return $stmt->execute();
    }

    public function eliminar($id)
    {
        $sql = "DELETE FROM proveedores WHERE IdProveedor = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
