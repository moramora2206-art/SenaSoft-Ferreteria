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

    public function buscarPorNit($nit)
    {
        if ($nit === null || $nit === '') {
            return null;
        }

        $sql = "SELECT IdProveedor as idProveedor FROM proveedores WHERE NIT = ? LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        if (!$stmt) {
            error_log('Error preparando buscarPorNit: ' . $this->conn->error);
            return null;
        }

        $stmt->bind_param("i", $nit);

        if (!$stmt->execute()) {
            error_log('Error ejecutando buscarPorNit: ' . $stmt->error);
            return null;
        }

        return $stmt->get_result()->fetch_assoc() ?: null;
    }

    private function ejecutarStmtConControlDuplicado($stmt)
    {
        if ($stmt->execute()) {
            return true;
        }

        if ($stmt->errno === 1062) {
            error_log('Violación de unicidad en proveedores: ' . $stmt->error);
            return 'DUPLICATE_NIT';
        }

        if ($stmt->errno === 1451) {
            error_log('Violación de clave foránea en proveedores: ' . $stmt->error);
            return 'FOREIGN_KEY_CONSTRAINT';
        }

        error_log('Error ejecutando operación sobre proveedores: ' . $stmt->error);
        return false;
    }

    public function crear($nombreProveedor, $nit, $nombreContacto, $nCelular, $email)
    {
        $sql = "INSERT INTO proveedores (Nombre_Proveedor, NIT, Nombre_Contacto, NCelular, Email) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sisss", $nombreProveedor, $nit, $nombreContacto, $nCelular, $email);
        return $this->ejecutarStmtConControlDuplicado($stmt);
    }

    public function actualizar($id, $nombreProveedor, $nit, $nombreContacto, $nCelular, $email)
    {
        $sql = "UPDATE proveedores SET Nombre_Proveedor=?, NIT=?, Nombre_Contacto=?, NCelular=?, Email=? WHERE IdProveedor=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sisssi", $nombreProveedor, $nit, $nombreContacto, $nCelular, $email, $id);
        return $this->ejecutarStmtConControlDuplicado($stmt);
    }

    public function eliminar($id)
    {
        $sql = "DELETE FROM proveedores WHERE IdProveedor = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $this->ejecutarStmtConControlDuplicado($stmt);
    }
}
