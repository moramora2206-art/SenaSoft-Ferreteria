<?php

class Ventas
{
    private $conn;

    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }


    public function resumen(
        $inicio,
        $fin
    ) {

        /*
         * KPI PRINCIPALES
         */
        $sqlKpi = "
            SELECT
                COALESCE(
                    SUM(Total),
                    0
                ) AS totalVentas,

                COUNT(*) AS cantidadFacturas,

                COALESCE(
                    AVG(Total),
                    0
                ) AS ticketPromedio

            FROM factura

            WHERE Estado = 'ACTIVA'

            AND Fecha_Venta
                BETWEEN ? AND ?
        ";

        $stmt =
            $this->conn->prepare(
                $sqlKpi
            );

        $stmt->bind_param(
            "ss",
            $inicio,
            $fin
        );

        $stmt->execute();

        $kpi =
            $stmt
                ->get_result()
                ->fetch_assoc();


        /*
         * UNIDADES VENDIDAS
         */
        $sqlUnidades = "
            SELECT
                COALESCE(
                    SUM(df.Cantidad),
                    0
                ) AS unidadesVendidas

            FROM detalle_factura df

            INNER JOIN factura f
                ON df.IdFactura =
                   f.IdFactura

            WHERE f.Estado = 'ACTIVA'

            AND f.Fecha_Venta
                BETWEEN ? AND ?
        ";

        $stmt =
            $this->conn->prepare(
                $sqlUnidades
            );

        $stmt->bind_param(
            "ss",
            $inicio,
            $fin
        );

        $stmt->execute();

        $unidades =
            $stmt
                ->get_result()
                ->fetch_assoc();


        /*
         * VENTAS POR DÍA
         */
        $sqlDias = "
            SELECT
                Fecha_Venta AS fecha,
                SUM(Total) AS total

            FROM factura

            WHERE Estado = 'ACTIVA'

            AND Fecha_Venta
                BETWEEN ? AND ?

            GROUP BY Fecha_Venta

            ORDER BY Fecha_Venta
        ";

        $stmt =
            $this->conn->prepare(
                $sqlDias
            );

        $stmt->bind_param(
            "ss",
            $inicio,
            $fin
        );

        $stmt->execute();

        $result =
            $stmt->get_result();

        $ventasPorDia = [];

        while (
            $row =
            $result->fetch_assoc()
        ) {
            $ventasPorDia[] = $row;
        }


        /*
         * FORMAS DE PAGO
         */
        $sqlPago = "
            SELECT
                Forma_dePago AS formaDePago,
                COUNT(*) AS cantidad,
                SUM(Total) AS total

            FROM factura

            WHERE Estado = 'ACTIVA'

            AND Fecha_Venta
                BETWEEN ? AND ?

            GROUP BY Forma_dePago

            ORDER BY total DESC
        ";

        $stmt =
            $this->conn->prepare(
                $sqlPago
            );

        $stmt->bind_param(
            "ss",
            $inicio,
            $fin
        );

        $stmt->execute();

        $result =
            $stmt->get_result();

        $ventasPorPago = [];

        while (
            $row =
            $result->fetch_assoc()
        ) {
            $ventasPorPago[] = $row;
        }


        /*
         * LISTADO DE FACTURAS DEL PERÍODO
         */
        $sqlListado = "
            SELECT

                f.IdFactura AS idFactura,

                f.Fecha_Venta AS fechaVenta,

                CONCAT(
                    c.Nombre,
                    ' ',
                    c.Apellido
                ) AS nombreCliente,

                f.Total AS total,

                f.Estado AS estado

            FROM factura f

            LEFT JOIN clientes c
                ON f.IdCliente =
                   c.IdCliente

            WHERE f.Fecha_Venta
                BETWEEN ? AND ?

            ORDER BY
                f.Fecha_Venta DESC,
                f.IdFactura DESC
        ";

        $stmt =
            $this->conn->prepare(
                $sqlListado
            );

        $stmt->bind_param(
            "ss",
            $inicio,
            $fin
        );

        $stmt->execute();

        $result =
            $stmt->get_result();

        $ventasListado = [];

        while (
            $row =
            $result->fetch_assoc()
        ) {
            $ventasListado[] = $row;
        }


        /*
         * PRODUCTOS MÁS VENDIDOS
         */
        $sqlProductos = "
            SELECT

                p.IdProducto AS idProducto,

                p.Nombre_Producto
                    AS nombreProducto,

                p.Codigo_SKU
                    AS codigoSKU,

                SUM(df.Cantidad)
                    AS unidades,

                SUM(df.Subtotal)
                    AS total

            FROM detalle_factura df

            INNER JOIN factura f
                ON df.IdFactura =
                   f.IdFactura

            INNER JOIN productos p
                ON df.IdProducto =
                   p.IdProducto

            WHERE f.Estado = 'ACTIVA'

            AND f.Fecha_Venta
                BETWEEN ? AND ?

            GROUP BY
                p.IdProducto,
                p.Nombre_Producto,
                p.Codigo_SKU

            ORDER BY unidades DESC

            LIMIT 10
        ";

        $stmt =
            $this->conn->prepare(
                $sqlProductos
            );

        $stmt->bind_param(
            "ss",
            $inicio,
            $fin
        );

        $stmt->execute();

        $result =
            $stmt->get_result();

        $productosMasVendidos = [];

        while (
            $row =
            $result->fetch_assoc()
        ) {
            $productosMasVendidos[] =
                $row;
        }


        return [

            "periodo" => [
                "inicio" => $inicio,
                "fin" => $fin
            ],

            "kpi" => [
                "totalVentas" =>
                    floatval(
                        $kpi["totalVentas"]
                    ),

                "cantidadFacturas" =>
                    intval(
                        $kpi["cantidadFacturas"]
                    ),

                "ticketPromedio" =>
                    floatval(
                        $kpi["ticketPromedio"]
                    ),

                "unidadesVendidas" =>
                    intval(
                        $unidades[
                            "unidadesVendidas"
                        ]
                    )
            ],

            "ventasPorDia" =>
                $ventasPorDia,

            "ventasPorPago" =>
                $ventasPorPago,

            "ventasListado" =>
                $ventasListado,

            "productosMasVendidos" =>
                $productosMasVendidos
        ];
    }
}