<?php

class Dashboard
{
    private $conn;

    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

    public function obtenerMetricas()
    {
        // 1. Total Productos
        $resProd = $this->conn->query("SELECT COUNT(*) as total FROM productos");
        $totalProductos = $resProd ? $resProd->fetch_assoc()['total'] : 0;

        // 2. Productos Stock Bajo (< 10 y > 0)
        $resBajo = $this->conn->query("SELECT COUNT(*) as total FROM productos WHERE Stock < 10 AND Stock > 0");
        $stockBajo = $resBajo ? $resBajo->fetch_assoc()['total'] : 0;

        // 3. Productos Agotados (= 0)
        $resAgotados = $this->conn->query("SELECT COUNT(*) as total FROM productos WHERE Stock <= 0");
        $productosAgotados = $resAgotados ? $resAgotados->fetch_assoc()['total'] : 0;

        // 4. Total Clientes
        $resCli = $this->conn->query("SELECT COUNT(*) as total FROM clientes");
        $totalClientes = $resCli ? $resCli->fetch_assoc()['total'] : 0;

        // 5. Total Proveedores
        $resProv = $this->conn->query("SELECT COUNT(*) as total FROM proveedores");
        $totalProveedores = $resProv ? $resProv->fetch_assoc()['total'] : 0;

        // 6. Total Facturas (solo ACTIVAS)
        $resFact = $this->conn->query("SELECT COUNT(*) as total FROM factura WHERE Estado = 'ACTIVA'");
        $totalFacturas = $resFact ? $resFact->fetch_assoc()['total'] : 0;

        // 7. Total Ventas ($) (solo ACTIVAS)
        $resVentas = $this->conn->query("SELECT SUM(Total) as total FROM factura WHERE Estado = 'ACTIVA'");
        $totalVentas = ($resVentas && $row = $resVentas->fetch_assoc()) ? ($row['total'] ?? 0) : 0;

        // 8. Lista de Alertas de Stock Bajo (detalles)
        $resAlertas = $this->conn->query("SELECT IdProducto as idProducto, Nombre_Producto as nombreProducto, Codigo_SKU as codigoSKU, Stock as stock, Categoria as categoria FROM productos WHERE Stock < 10 AND Stock > 0 ORDER BY Stock ASC LIMIT 5");
        $alertasStock = [];
        if ($resAlertas) {
            while ($row = $resAlertas->fetch_assoc()) {
                $alertasStock[] = $row;
            }
        }

        // 9. Últimas Facturas registradas (solo ACTIVAS)
        $resUltFact = $this->conn->query("SELECT f.IdFactura as idFactura, CONCAT(c.Nombre, ' ', c.Apellido) as cliente, f.Fecha_Venta as fecha, f.Total as total FROM factura f LEFT JOIN clientes c ON f.IdCliente = c.IdCliente WHERE f.Estado = 'ACTIVA' ORDER BY f.IdFactura DESC LIMIT 5");
        $ultimasVentas = [];
        if ($resUltFact) {
            while ($row = $resUltFact->fetch_assoc()) {
                $ultimasVentas[] = $row;
            }
        }

        return [
            "totalProductos" => intval($totalProductos),
            "stockBajo" => intval($stockBajo),
            "productosAgotados" => intval($productosAgotados),
            "totalClientes" => intval($totalClientes),
            "totalProveedores" => intval($totalProveedores),
            "totalFacturas" => intval($totalFacturas),
            "totalVentas" => floatval($totalVentas),
            "alertasStock" => $alertasStock,
            "ultimasVentas" => $ultimasVentas
        ];
    }
}
