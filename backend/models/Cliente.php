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

    public function buscarPorCedula($cedula)
    {
        if ($cedula === null || $cedula === '') {
            return null;
        }

        $sql = "SELECT IdCliente as idCliente FROM clientes WHERE `Cédula` = ? LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        if (!$stmt) {
            error_log('Error preparando buscarPorCedula: ' . $this->conn->error);
            return null;
        }

        $stmt->bind_param("s", $cedula);

        if (!$stmt->execute()) {
            error_log('Error ejecutando buscarPorCedula: ' . $stmt->error);
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
            error_log('Violación de unicidad en clientes: ' . $stmt->error);
            return 'DUPLICATE_CEDULA';
        }

        if ($stmt->errno === 1451) {
            error_log('Violación de clave foránea en clientes: ' . $stmt->error);
            return 'FOREIGN_KEY_CONSTRAINT';
        }

        error_log('Error ejecutando operación sobre clientes: ' . $stmt->error);
        return false;
    }

    public function crear($nombre, $apellido, $cedula, $nCelular, $email, $direccion)
    {
        $sql = "INSERT INTO clientes (Nombre, Apellido, `Cédula`, NCelular, Email, `Dirección`) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssss", $nombre, $apellido, $cedula, $nCelular, $email, $direccion);
        return $this->ejecutarStmtConControlDuplicado($stmt);
    }

    public function actualizar($id, $nombre, $apellido, $cedula, $nCelular, $email, $direccion)
    {
        $sql = "UPDATE clientes SET Nombre=?, Apellido=?, `Cédula`=?, NCelular=?, Email=?, `Dirección`=? WHERE IdCliente=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssssi", $nombre, $apellido, $cedula, $nCelular, $email, $direccion, $id);
        return $this->ejecutarStmtConControlDuplicado($stmt);
    }

    public function eliminar($id)
    {
        $sql = "DELETE FROM clientes WHERE IdCliente = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $this->ejecutarStmtConControlDuplicado($stmt);
    }
}
