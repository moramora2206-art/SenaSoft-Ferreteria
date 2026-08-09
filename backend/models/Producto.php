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

    public function crear($idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion)
    {
        $sql = "INSERT INTO productos (IdProveedor, Nombre_Producto, Codigo_SKU, Stock, Precio_Unitario, Precio_Compra, Categoria, Imagen, Fecha_Vencimiento, Descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) return false;
        $stmt->bind_param("issiddssss", $idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion);
        return $stmt->execute();
    }

    public function actualizar($id, $idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion)
    {
        $sql = "UPDATE productos SET IdProveedor=?, Nombre_Producto=?, Codigo_SKU=?, Stock=?, Precio_Unitario=?, Precio_Compra=?, Categoria=?, Imagen=?, Fecha_Vencimiento=?, Descripcion=? WHERE IdProducto = ?";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) return false;
        $stmt->bind_param("issiddsss si", $idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion, $id);
        // Note: Above bind_param string intentionally split due to readability; reconstruct properly
        // Re-bind correctly:
        $stmt->close();
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) return false;
        $types = "issiddsss i"; // placeholder, we'll use compact
        // Correct types: i (idProveedor), s, s, i, d, d, s, s, s, s, i -> "issiddsss si" (without spaces)
        $types = "issiddssssi";
        $stmt->bind_param($types, $idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion, $id);
        return $stmt->execute();
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

    public function eliminar($id)
    {
        $sql = "DELETE FROM productos WHERE IdProducto = ?";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) return false;
        $stmt->bind_param("i", $id);
        $ok = $stmt->execute();
        return $ok;
    }
}
