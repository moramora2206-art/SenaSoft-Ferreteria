<?php

class Factura
{
    private $conn;

    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

<<<<<<< HEAD
    /*
     * CREAR FACTURA
     */
    public function crear(
        $idUsuario,
        $idCliente,
        $formaDePago,
        $descuento,
        $observaciones,
        $detalles
    ) {
        $this->conn->begin_transaction();

        try {

            if (empty($detalles)) {
                throw new Exception("La factura debe tener productos.");
            }

            /*
             * 1. Crear cabecera inicialmente con total 0.
             * El total real lo calculamos nosotros.
             */
            $sqlFactura = "
                INSERT INTO factura
                (
                    IdUsuario,
                    IdCliente,
                    Fecha_Venta,
                    Forma_dePago,
                    Descuento,
                    Total,
                    Estado,
                    Observaciones
                )
                VALUES (?, ?, CURDATE(), ?, ?, 0, 'ACTIVA', ?)
            ";

            $stmt = $this->conn->prepare($sqlFactura);

            if (!$stmt) {
                throw new Exception(
                    "Error preparando factura: " . $this->conn->error
                );
            }

            $stmt->bind_param(
                "iisds",
                $idUsuario,
                $idCliente,
                $formaDePago,
                $descuento,
                $observaciones
            );

            if (!$stmt->execute()) {
                throw new Exception(
                    "Error al guardar la factura: " . $stmt->error
                );
=======
    public function crear($idUsuario, $idCliente, $formaDePago, $descuento, $total, $observaciones, $detalles)
    {
        $this->conn->begin_transaction();

        try {
            $sqlFactura = "INSERT INTO factura (IdUsuario, IdCliente, Fecha_Venta, Forma_dePago, Descuento, Total, Observaciones) VALUES (?, ?, CURDATE(), ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($sqlFactura);
            $stmt->bind_param("iisdds", $idUsuario, $idCliente, $formaDePago, $descuento, $total, $observaciones);
            
            if (!$stmt->execute()) {
                throw new Exception("Error al guardar la cabecera de la factura: " . $stmt->error);
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
            }

            $facturaId = $this->conn->insert_id;

<<<<<<< HEAD
            /*
             * 2. Preparar detalle
             */
            $sqlProducto = "
                SELECT
                    IdProducto,
                    Nombre_Producto,
                    Precio_Unitario,
                    Stock
                FROM productos
                WHERE IdProducto = ?
                FOR UPDATE
            ";

            $stmtProducto = $this->conn->prepare($sqlProducto);

            $sqlDetalle = "
                INSERT INTO detalle_factura
                (
                    IdFactura,
                    IdProducto,
                    Cantidad,
                    Subtotal
                )
                VALUES (?, ?, ?, ?)
            ";

            $stmtDetalle = $this->conn->prepare($sqlDetalle);

            $sqlStock = "
                UPDATE productos
                SET Stock = Stock - ?
                WHERE IdProducto = ?
            ";

            $stmtStock = $this->conn->prepare($sqlStock);

            $subtotalGeneral = 0;

            /*
             * 3. Procesar productos
             */
            foreach ($detalles as $d) {

                $idProducto = intval($d->idProducto);
                $cantidad = intval($d->cantidad);

                if ($idProducto <= 0) {
                    throw new Exception("Producto inválido.");
                }

                if ($cantidad <= 0) {
                    throw new Exception(
                        "La cantidad debe ser mayor que cero."
                    );
                }

                /*
                 * Obtener precio y stock reales de BD.
                 */
                $stmtProducto->bind_param("i", $idProducto);

                if (!$stmtProducto->execute()) {
                    throw new Exception(
                        "No se pudo consultar el producto."
                    );
                }

                $producto = $stmtProducto
                    ->get_result()
                    ->fetch_assoc();

                if (!$producto) {
                    throw new Exception(
                        "El producto ID $idProducto no existe."
                    );
                }

                $stockActual = intval($producto["Stock"]);
                $precio = floatval($producto["Precio_Unitario"]);

                /*
                 * Validar stock.
                 */
                if ($stockActual < $cantidad) {
                    throw new Exception(
                        "Stock insuficiente para {$producto['Nombre_Producto']}. " .
                        "Disponible: $stockActual."
                    );
                }

                /*
                 * Calcular subtotal en servidor.
                 */
                $subtotal = $cantidad * $precio;

                $subtotalGeneral += $subtotal;

                /*
                 * Insertar detalle.
                 */
                $stmtDetalle->bind_param(
                    "iiid",
                    $facturaId,
                    $idProducto,
                    $cantidad,
                    $subtotal
                );

                if (!$stmtDetalle->execute()) {
                    throw new Exception(
                        "Error al insertar el producto " .
                        $producto["Nombre_Producto"]
                    );
                }

                /*
                 * Descontar inventario.
                 */
                $stmtStock->bind_param(
                    "ii",
                    $cantidad,
                    $idProducto
                );

                if (!$stmtStock->execute()) {
                    throw new Exception(
                        "No se pudo actualizar el inventario."
                    );
                }
            }

            /*
             * 4. Validar descuento.
             */
            $descuento = floatval($descuento);

            if ($descuento < 0) {
                $descuento = 0;
            }

            if ($descuento > $subtotalGeneral) {
                throw new Exception(
                    "El descuento no puede superar el subtotal."
                );
            }

            /*
             * 5. Calcular total real.
             */
            $total = $subtotalGeneral - $descuento;

            /*
             * 6. Actualizar total.
             */
            $sqlTotal = "
                UPDATE factura
                SET Total = ?, Descuento = ?
                WHERE IdFactura = ?
            ";

            $stmtTotal = $this->conn->prepare($sqlTotal);

            $stmtTotal->bind_param(
                "ddi",
                $total,
                $descuento,
                $facturaId
            );

            if (!$stmtTotal->execute()) {
                throw new Exception(
                    "No se pudo actualizar el total."
                );
            }

            /*
             * 7. Confirmar transacción.
             */
            $this->conn->commit();

            return [
                "success" => true,
                "facturaId" => $facturaId,
                "total" => $total
            ];

        } catch (Exception $e) {

            $this->conn->rollback();

=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
            return [
                "success" => false,
                "error" => $e->getMessage()
            ];
        }
    }

<<<<<<< HEAD

    /*
     * LISTAR FACTURAS
     */
    public function listar()
    {
        $sql = "
            SELECT
                f.IdFactura AS idFactura,
                f.IdUsuario AS idUsuario,
                f.IdCliente AS idCliente,
                CONCAT(c.Nombre, ' ', c.Apellido) AS nombreCliente,
                f.Fecha_Venta AS fechaVenta,
                f.Forma_dePago AS formaDePago,
                f.Descuento AS descuento,
                f.Total AS total,
                f.Estado AS estado,
                f.Observaciones AS observaciones
            FROM factura f
            LEFT JOIN clientes c
                ON f.IdCliente = c.IdCliente
            ORDER BY f.IdFactura DESC
        ";

        $result = $this->conn->query($sql);

        $facturas = [];

=======
    public function listar()
    {
        $sql = "SELECT f.IdFactura as idFactura, f.IdUsuario as idUsuario, f.IdCliente as idCliente, CONCAT(c.Nombre, ' ', c.Apellido) as nombreCliente, f.Fecha_Venta as fechaVenta, f.Forma_dePago as formaDePago, f.Descuento as descuento, f.Total as total, f.Observaciones as observaciones 
                FROM factura f 
                LEFT JOIN clientes c ON f.IdCliente = c.IdCliente 
                ORDER BY f.IdFactura DESC";
        $result = $this->conn->query($sql);

        $facturas = [];
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        while ($row = $result->fetch_assoc()) {
            $facturas[] = $row;
        }

        return $facturas;
    }

<<<<<<< HEAD

    /*
     * BUSCAR FACTURA
     */
    public function buscarPorId($id)
    {
        $sql = "
            SELECT
                f.IdFactura AS idFactura,
                f.IdUsuario AS idUsuario,
                f.IdCliente AS idCliente,
                CONCAT(c.Nombre, ' ', c.Apellido) AS nombreCliente,
                f.Fecha_Venta AS fechaVenta,
                f.Forma_dePago AS formaDePago,
                f.Descuento AS descuento,
                f.Total AS total,
                f.Estado AS estado,
                f.Observaciones AS observaciones
            FROM factura f
            LEFT JOIN clientes c
                ON f.IdCliente = c.IdCliente
            WHERE f.IdFactura = ?
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();

        $factura = $stmt
            ->get_result()
            ->fetch_assoc();

        if ($factura) {
            $factura["detalles"] =
                $this->consultarDetalles($id);
=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        }

        return $factura;
    }

<<<<<<< HEAD

    /*
     * DETALLES
     */
    public function consultarDetalles($facturaId)
    {
        $sql = "
            SELECT
                df.IdDetalle AS idDetalle,
                df.IdFactura AS idFactura,
                df.IdProducto AS idProducto,
                p.Nombre_Producto AS nombreProducto,
                p.Codigo_SKU AS codigoSKU,
                df.Cantidad AS cantidad,
                p.Precio_Unitario AS precioUnitario,
                df.Subtotal AS subtotal
            FROM detalle_factura df
            INNER JOIN productos p
                ON df.IdProducto = p.IdProducto
            WHERE df.IdFactura = ?
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $facturaId);
        $stmt->execute();

        $result = $stmt->get_result();

        $detalles = [];

=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        while ($row = $result->fetch_assoc()) {
            $detalles[] = $row;
        }

        return $detalles;
    }

<<<<<<< HEAD

    /*
     * ANULAR FACTURA
     *
     * Devuelve el stock y conserva la factura.
     */
    public function anular($id)
    {
        $this->conn->begin_transaction();

        try {

            /*
             * Buscar factura.
             */
            $sqlFactura = "
                SELECT Estado
                FROM factura
                WHERE IdFactura = ?
                FOR UPDATE
            ";

            $stmtFactura = $this->conn->prepare($sqlFactura);
            $stmtFactura->bind_param("i", $id);
            $stmtFactura->execute();

            $factura = $stmtFactura
                ->get_result()
                ->fetch_assoc();

            if (!$factura) {
                throw new Exception(
                    "La factura no existe."
                );
            }

            if ($factura["Estado"] === "ANULADA") {
                throw new Exception(
                    "La factura ya está anulada."
                );
            }

            /*
             * Obtener productos de la factura.
             */
            $sqlDetalles = "
                SELECT
                    IdProducto,
                    Cantidad
                FROM detalle_factura
                WHERE IdFactura = ?
            ";

            $stmtDetalles = $this->conn->prepare($sqlDetalles);
            $stmtDetalles->bind_param("i", $id);
            $stmtDetalles->execute();

            $result = $stmtDetalles->get_result();

            /*
             * Devolver stock.
             */
            $sqlStock = "
                UPDATE productos
                SET Stock = Stock + ?
                WHERE IdProducto = ?
            ";

            $stmtStock = $this->conn->prepare($sqlStock);

            while ($detalle = $result->fetch_assoc()) {

                $cantidad = intval($detalle["Cantidad"]);
                $idProducto = intval($detalle["IdProducto"]);

                $stmtStock->bind_param(
                    "ii",
                    $cantidad,
                    $idProducto
                );

                if (!$stmtStock->execute()) {
                    throw new Exception(
                        "No se pudo devolver stock del producto."
                    );
                }
            }

            /*
             * Marcar factura como anulada.
             */
            $sqlAnular = "
                UPDATE factura
                SET Estado = 'ANULADA'
                WHERE IdFactura = ?
            ";

            $stmtAnular = $this->conn->prepare($sqlAnular);
            $stmtAnular->bind_param("i", $id);

            if (!$stmtAnular->execute()) {
                throw new Exception(
                    "No se pudo anular la factura."
                );
            }

            $this->conn->commit();

            return [
                "success" => true
            ];

        } catch (Exception $e) {

            $this->conn->rollback();

            return [
                "success" => false,
                "error" => $e->getMessage()
            ];
        }
    }
}
=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
