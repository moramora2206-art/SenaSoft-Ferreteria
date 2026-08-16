<?php

class FacturaException extends Exception
{
    public $errorCode;

    public function __construct($message, $errorCode)
    {
        parent::__construct($message);
        $this->errorCode = $errorCode;
    }
}

class Factura
{
    private $conn;

    public function __construct($conexion)
    {
        $this->conn = $conexion;
    }

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
                throw new FacturaException("La factura debe tener productos.", "VALIDATION_ERROR");
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
                error_log('Error preparando cabecera de factura: ' . $this->conn->error);
                throw new FacturaException("No se pudo preparar el registro de la factura.", "DATABASE_ERROR");
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
                if ($stmt->errno === 1451 || $stmt->errno === 1452) {
                    throw new FacturaException("El cliente seleccionado no existe.", "CLIENTE_NO_ENCONTRADO");
                }
                error_log('Error insertando cabecera de factura: ' . $stmt->error);
                throw new FacturaException("No se pudo guardar la factura.", "DATABASE_ERROR");
            }

            $facturaId = $this->conn->insert_id;

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

            if (!$stmtProducto) {
                error_log('Error preparando consulta de producto: ' . $this->conn->error);
                throw new FacturaException("No se pudo preparar la consulta del producto.", "DATABASE_ERROR");
            }

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

            if (!$stmtDetalle) {
                error_log('Error preparando inserción de detalle: ' . $this->conn->error);
                throw new FacturaException("No se pudo preparar el detalle de la factura.", "DATABASE_ERROR");
            }

            $sqlStock = "
                UPDATE productos
                SET Stock = Stock - ?
                WHERE IdProducto = ?
            ";

            $stmtStock = $this->conn->prepare($sqlStock);

            if (!$stmtStock) {
                error_log('Error preparando actualización de stock: ' . $this->conn->error);
                throw new FacturaException("No se pudo preparar la actualización de stock.", "DATABASE_ERROR");
            }

            $subtotalGeneral = 0;

            /*
             * 3. Procesar productos
             */
            foreach ($detalles as $d) {

                $idProducto = intval($d->idProducto);
                $cantidad = intval($d->cantidad);

                if ($idProducto <= 0) {
                    throw new FacturaException("Producto inválido.", "VALIDATION_ERROR");
                }

                if ($cantidad <= 0) {
                    throw new FacturaException(
                        "La cantidad debe ser mayor que cero.",
                        "VALIDATION_ERROR"
                    );
                }

                /*
                 * Obtener precio y stock reales de BD.
                 */
                $stmtProducto->bind_param("i", $idProducto);

                if (!$stmtProducto->execute()) {
                    error_log('Error consultando producto: ' . $stmtProducto->error);
                    throw new FacturaException(
                        "No se pudo consultar el producto.",
                        "DATABASE_ERROR"
                    );
                }

                $producto = $stmtProducto
                    ->get_result()
                    ->fetch_assoc();

                if (!$producto) {
                    throw new FacturaException(
                        "El producto seleccionado ya no existe.",
                        "PRODUCTO_NO_ENCONTRADO"
                    );
                }

                $stockActual = intval($producto["Stock"]);
                $precio = floatval($producto["Precio_Unitario"]);

                /*
                 * Validar stock.
                 */
                if ($stockActual < $cantidad) {
                    throw new FacturaException(
                        "Stock insuficiente para {$producto['Nombre_Producto']}. " .
                        "Disponible: $stockActual.",
                        "INSUFFICIENT_STOCK"
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
                    if ($stmtDetalle->errno === 1451 || $stmtDetalle->errno === 1452) {
                        throw new FacturaException(
                            "El producto seleccionado ya no existe.",
                            "PRODUCTO_NO_ENCONTRADO"
                        );
                    }
                    error_log('Error insertando detalle de factura: ' . $stmtDetalle->error);
                    throw new FacturaException(
                        "No se pudo guardar el detalle de la factura.",
                        "DATABASE_ERROR"
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
                    error_log('Error descontando stock: ' . $stmtStock->error);
                    throw new FacturaException(
                        "No se pudo actualizar el inventario.",
                        "DATABASE_ERROR"
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
                throw new FacturaException(
                    "El descuento no puede superar el subtotal.",
                    "VALIDATION_ERROR"
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

            if (!$stmtTotal) {
                error_log('Error preparando actualización de total: ' . $this->conn->error);
                throw new FacturaException("No se pudo actualizar el total.", "DATABASE_ERROR");
            }

            $stmtTotal->bind_param(
                "ddi",
                $total,
                $descuento,
                $facturaId
            );

            if (!$stmtTotal->execute()) {
                error_log('Error actualizando total de factura: ' . $stmtTotal->error);
                throw new FacturaException(
                    "No se pudo actualizar el total.",
                    "DATABASE_ERROR"
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

            if ($e instanceof FacturaException) {
                return [
                    "success" => false,
                    "error" => $e->getMessage(),
                    "errorCode" => $e->errorCode
                ];
            }

            error_log('Error inesperado en Factura::crear: ' . $e->getMessage());
            return [
                "success" => false,
                "error" => "Ocurrió un error inesperado al registrar la factura.",
                "errorCode" => "DATABASE_ERROR"
            ];
        }
    }


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

        while ($row = $result->fetch_assoc()) {
            $facturas[] = $row;
        }

        return $facturas;
    }


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
        }

        return $factura;
    }


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

        while ($row = $result->fetch_assoc()) {
            $detalles[] = $row;
        }

        return $detalles;
    }


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

            if (!$stmtFactura) {
                error_log('Error preparando consulta de factura para anular: ' . $this->conn->error);
                throw new FacturaException("No se pudo preparar la consulta de la factura.", "DATABASE_ERROR");
            }

            $stmtFactura->bind_param("i", $id);
            $stmtFactura->execute();

            $factura = $stmtFactura
                ->get_result()
                ->fetch_assoc();

            if (!$factura) {
                throw new FacturaException(
                    "La factura no existe.",
                    "FACTURA_NO_ENCONTRADA"
                );
            }

            if ($factura["Estado"] === "ANULADA") {
                throw new FacturaException(
                    "La factura ya está anulada.",
                    "FACTURA_YA_ANULADA"
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

            if (!$stmtDetalles) {
                error_log('Error preparando consulta de detalles para anular: ' . $this->conn->error);
                throw new FacturaException("No se pudo preparar la consulta de detalles.", "DATABASE_ERROR");
            }

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

            if (!$stmtStock) {
                error_log('Error preparando devolución de stock: ' . $this->conn->error);
                throw new FacturaException("No se pudo preparar la devolución de stock.", "DATABASE_ERROR");
            }

            while ($detalle = $result->fetch_assoc()) {

                $cantidad = intval($detalle["Cantidad"]);
                $idProducto = intval($detalle["IdProducto"]);

                $stmtStock->bind_param(
                    "ii",
                    $cantidad,
                    $idProducto
                );

                if (!$stmtStock->execute()) {
                    error_log('Error devolviendo stock: ' . $stmtStock->error);
                    throw new FacturaException(
                        "No se pudo devolver stock del producto.",
                        "DATABASE_ERROR"
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

            if (!$stmtAnular) {
                error_log('Error preparando anulación de factura: ' . $this->conn->error);
                throw new FacturaException("No se pudo anular la factura.", "DATABASE_ERROR");
            }

            $stmtAnular->bind_param("i", $id);

            if (!$stmtAnular->execute()) {
                error_log('Error anulando factura: ' . $stmtAnular->error);
                throw new FacturaException(
                    "No se pudo anular la factura.",
                    "DATABASE_ERROR"
                );
            }

            $this->conn->commit();

            return [
                "success" => true
            ];

        } catch (Exception $e) {

            $this->conn->rollback();

            if ($e instanceof FacturaException) {
                return [
                    "success" => false,
                    "error" => $e->getMessage(),
                    "errorCode" => $e->errorCode
                ];
            }

            error_log('Error inesperado en Factura::anular: ' . $e->getMessage());
            return [
                "success" => false,
                "error" => "Ocurrió un error inesperado al anular la factura.",
                "errorCode" => "DATABASE_ERROR"
            ];
        }
    }
}