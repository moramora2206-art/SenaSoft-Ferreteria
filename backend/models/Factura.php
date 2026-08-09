<?php

class Factura
{
    private $conn;

    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    public function crear($idUsuario, $idCliente, $formaDePago, $descuento, $total, $observaciones, $detalles)
    {
        $this->conn->begin_transaction();

        try {
            $sqlFactura = "INSERT INTO factura (IdUsuario, IdCliente, Fecha_Venta, Forma_dePago, Descuento, Total, Observaciones) VALUES (?, ?, CURDATE(), ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($sqlFactura);
            $stmt->bind_param("iisdds", $idUsuario, $idCliente, $formaDePago, $descuento, $total, $observaciones);
            
            if (!$stmt->execute()) {
                throw new Exception("Error al guardar la cabecera de la factura: " . $stmt->error);
            }

            $facturaId = $this->conn->insert_id;

            $sqlDetalle = "INSERT INTO detalle_factura (IdFactura, IdProducto, Cantidad, Subtotal) VALUES (?, ?, ?, ?)";
            $stmtDetalle = $this->conn->prepare($sqlDetalle);

            $sqlStock = "UPDATE productos SET Stock = Stock - ? WHERE IdProducto = ? AND Stock >= ?";
            $stmtStock = $this->conn->prepare($sqlStock);

            foreach ($detalles as $d) {
                $idProducto = intval($d->idProducto);
                $cantidad = intval($d->cantidad);
                $subtotal = floatval($d->subtotal);

                // Insertar línea de detalle
                $stmtDetalle->bind_param("iiid", $facturaId, $idProducto, $cantidad, $subtotal);
                if (!$stmtDetalle->execute()) {
                    throw new Exception("Error al insertar detalle del producto ID $idProducto");
                }

                // Descontar inventario
                $stmtStock->bind_param("iii", $cantidad, $idProducto, $cantidad);
                $stmtStock->execute();

                if ($stmtStock->affected_rows === 0) {
                    throw new Exception("Stock insuficiente para el producto ID $idProducto");
                }
            }

            $this->conn->commit();
            return [
                "success" => true,
                "facturaId" => $facturaId
            ];

        } catch (Exception $e) {
            $this->conn->rollback();
            return [
                "success" => false,
                "error" => $e->getMessage()
            ];
        }
    }

    public function listar()
    {
        $sql = "SELECT f.IdFactura as idFactura, f.IdUsuario as idUsuario, f.IdCliente as idCliente, CONCAT(c.Nombre, ' ', c.Apellido) as nombreCliente, f.Fecha_Venta as fechaVenta, f.Forma_dePago as formaDePago, f.Descuento as descuento, f.Total as total, f.Observaciones as observaciones 
                FROM factura f 
                LEFT JOIN clientes c ON f.IdCliente = c.IdCliente 
                ORDER BY f.IdFactura DESC";
        $result = $this->conn->query($sql);

        $facturas = [];
        while ($row = $result->fetch_assoc()) {
            $facturas[] = $row;
        }

        return $facturas;
    }

    public function buscarPorId($id)
    {
        $sql = "SELECT f.IdFactura as idFactura, f.IdUsuario as idUsuario, f.IdCliente as idCliente, CONCAT(c.Nombre, ' ', c.Apellido) as nombreCliente, f.Fecha_Venta as fechaVenta, f.Forma_dePago as formaDePago, f.Descuento as descuento, f.Total as total, f.Observaciones as observaciones 
                FROM factura f 
                LEFT JOIN clientes c ON f.IdCliente = c.IdCliente 
                WHERE f.IdFactura = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $factura = $stmt->get_result()->fetch_assoc();

        if ($factura) {
            $factura["detalles"] = $this->consultarDetalles($id);
        }

        return $factura;
    }

    public function consultarDetalles($facturaId)
    {
        $sql = "SELECT df.IdDetalle as idDetalle, df.IdFactura as idFactura, df.IdProducto as idProducto, p.Nombre_Producto as nombreProducto, p.Codigo_SKU as codigoSKU, df.Cantidad as cantidad, df.Subtotal as subtotal 
                FROM detalle_factura df 
                INNER JOIN productos p ON df.IdProducto = p.IdProducto 
                WHERE df.IdFactura = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $facturaId);
        $stmt->execute();
        $result = $stmt->get_result();

        $detalles = [];
        while ($row = $result->fetch_assoc()) {
            $detalles[] = $row;
        }

        return $detalles;
    }

    public function eliminar($id)
    {
        $this->conn->begin_transaction();
        try {
            // Eliminar detalles primero
            $sqlDetalles = "DELETE FROM detalle_factura WHERE IdFactura = ?";
            $stmtDet = $this->conn->prepare($sqlDetalles);
            $stmtDet->bind_param("i", $id);
            $stmtDet->execute();

            // Eliminar cabecera
            $sqlFactura = "DELETE FROM factura WHERE IdFactura = ?";
            $stmtFact = $this->conn->prepare($sqlFactura);
            $stmtFact->bind_param("i", $id);
            $stmtFact->execute();

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollback();
            return false;
        }
    }
}
