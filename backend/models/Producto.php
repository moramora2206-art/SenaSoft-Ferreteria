<?php

class Producto
{
    private $conn;

    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    public function listar($busqueda = "", $categoria = "", $proveedorId = null)
    {
        $sql = "SELECT p.IdProducto as idProducto, p.IdProveedor as idProveedor, pr.Nombre_Proveedor as nombreProveedor, p.Nombre_Producto as nombreProducto, p.Codigo_SKU as codigoSKU, p.Stock as stock, p.Precio_Unitario as precioUnitario, p.Precio_Compra as precioCompra, p.Categoria as categoria, p.Imagen as imagen, p.Fecha_Vencimiento as fechaVencimiento, p.Descripcion as descripcion
                FROM productos p
                LEFT JOIN proveedores pr ON p.IdProveedor = pr.IdProveedor
                WHERE 1=1";

        $params = [];
        $types = "";

        if (!empty($busqueda)) {
            $sql .= " AND (p.Nombre_Producto LIKE ? OR p.Codigo_SKU LIKE ? OR p.Descripcion LIKE ?)";
            $searchTerm = "%" . $busqueda . "%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $types .= "sss";
        }

        if (!empty($categoria)) {
            $sql .= " AND p.Categoria = ?";
            $params[] = $categoria;
            $types .= "s";
        }

        if ($proveedorId !== null && $proveedorId !== "") {
            $sql .= " AND p.IdProveedor = ?";
            $params[] = $proveedorId;
            $types .= "i";
        }

        $sql .= " ORDER BY p.IdProducto DESC";

        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) {
            return [];
        }
        if (!empty($types)) {
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $productos = [];
        while ($row = $result->fetch_assoc()) {
            $productos[] = $row;
        }

        return $productos;
    }

    public function buscarPorId($id)
    {
        $sql = "SELECT p.IdProducto as idProducto, p.IdProveedor as idProveedor, pr.Nombre_Proveedor as nombreProveedor, p.Nombre_Producto as nombreProducto, p.Codigo_SKU as codigoSKU, p.Stock as stock, p.Precio_Unitario as precioUnitario, p.Precio_Compra as precioCompra, p.Categoria as categoria, p.Imagen as imagen, p.Fecha_Vencimiento as fechaVencimiento, p.Descripcion as descripcion
                FROM productos p
                LEFT JOIN proveedores pr ON p.IdProveedor = pr.IdProveedor
                WHERE p.IdProducto = ?";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) return null;
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function buscarPorSku($sku)
    {
        if ($sku === null || $sku === '') {
            return null;
        }

        $sql = "SELECT IdProducto as idProducto FROM productos WHERE Codigo_SKU = ? LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        if ($stmt === false) {
            error_log('Error preparando buscarPorSku: ' . $this->conn->error);
            return null;
        }

        $stmt->bind_param("s", $sku);

        if (!$stmt->execute()) {
            error_log('Error ejecutando buscarPorSku: ' . $stmt->error);
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
            error_log('Violación de unicidad en productos: ' . $stmt->error);
            return 'DUPLICATE_CODE';
        }

        if ($stmt->errno === 1451 || $stmt->errno === 1452) {
            error_log('Violación de clave foránea en productos: ' . $stmt->error);
            return 'FOREIGN_KEY_CONSTRAINT';
        }

        error_log('Error ejecutando operación sobre productos: ' . $stmt->error);
        return false;
    }

    public function crear($idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion)
    {
        $sql = "INSERT INTO productos (IdProveedor, Nombre_Producto, Codigo_SKU, Stock, Precio_Unitario, Precio_Compra, Categoria, Imagen, Fecha_Vencimiento, Descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) return false;
        $stmt->bind_param("issiddssss", $idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion);
        return $this->ejecutarStmtConControlDuplicado($stmt);
    }

    public function actualizar($id, $idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion)
    {
        $sql = "UPDATE productos SET IdProveedor=?, Nombre_Producto=?, Codigo_SKU=?, Stock=?, Precio_Unitario=?, Precio_Compra=?, Categoria=?, Imagen=?, Fecha_Vencimiento=?, Descripcion=? WHERE IdProducto=?";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) return false;
        $types = "issiddssssi";
        $stmt->bind_param($types, $idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion, $id);
        return $this->ejecutarStmtConControlDuplicado($stmt);
    }

    public function actualizarStock($id, $cantidad)
    {
        $sql = "UPDATE productos SET Stock = Stock - ? WHERE IdProducto = ? AND Stock >= ?";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) return false;
        $stmt->bind_param("iii", $cantidad, $id, $cantidad);
        $ok = $stmt->execute();
        return $ok && $stmt->affected_rows > 0;
    }

    public function entradaStock($idProducto, $cantidad)
    {
        $id = intval($idProducto);
        $cantidad = intval($cantidad);
        if ($id <= 0 || $cantidad <= 0) {
            return [
                "success" => false,
                "message" => "Parámetros inválidos",
                "errorCode" => "VALIDATION_ERROR"
            ];
        }

        $this->conn->begin_transaction();

        try {
            // Bloquear la fila para evitar condiciones de carrera
            $sqlSelect = "SELECT Stock FROM productos WHERE IdProducto = ? FOR UPDATE";
            $stmtSel = $this->conn->prepare($sqlSelect);
            if ($stmtSel === false) {
                error_log('Error preparando consulta de stock: ' . $this->conn->error);
                throw new Exception("No se pudo preparar la consulta de stock.");
            }
            $stmtSel->bind_param("i", $id);
            $stmtSel->execute();
            $result = $stmtSel->get_result();
            $row = $result->fetch_assoc();
            if (!$row) {
                throw new Exception("El producto no existe.");
            }
            $stockAnterior = intval($row['Stock']);

            // Actualizar stock sumando la cantidad
            $sqlUpdate = "UPDATE productos SET Stock = Stock + ? WHERE IdProducto = ?";
            $stmtUpd = $this->conn->prepare($sqlUpdate);
            if ($stmtUpd === false) {
                error_log('Error preparando actualización de stock: ' . $this->conn->error);
                throw new Exception("No se pudo preparar la actualización de stock.");
            }
            $stmtUpd->bind_param("ii", $cantidad, $id);
            if (!$stmtUpd->execute()) {
                error_log('Error actualizando stock: ' . $stmtUpd->error);
                throw new Exception("No se pudo actualizar el stock.");
            }

            if ($stmtUpd->affected_rows === 0) {
                throw new Exception("No se actualizó el stock (producto no encontrado o sin cambio).");
            }

            $stockNuevo = $stockAnterior + $cantidad;

            $this->conn->commit();

            return [
                "success" => true,
                "idProducto" => $id,
                "stockAnterior" => $stockAnterior,
                "cantidadIngresada" => $cantidad,
                "stockNuevo" => $stockNuevo
            ];
        } catch (Exception $e) {
            $this->conn->rollback();
            $mensaje = $e->getMessage();
            $errorCode = "DATABASE_ERROR";
            if ($mensaje === "El producto no existe.") {
                $errorCode = "PRODUCTO_NO_ENCONTRADO";
            } else if ($mensaje === "No se actualizó el stock (producto no encontrado o sin cambio).") {
                $errorCode = "PRODUCTO_NO_ENCONTRADO";
            }
            return [
                "success" => false,
                "message" => $mensaje,
                "errorCode" => $errorCode
            ];
        }
    }

    public function eliminar($id)
    {
        $sql = "DELETE FROM productos WHERE IdProducto = ?";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) return false;
        $stmt->bind_param("i", $id);
        return $this->ejecutarStmtConControlDuplicado($stmt);
    }
}
