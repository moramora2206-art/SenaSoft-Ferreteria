<?php

require_once(__DIR__ . "/../models/Producto.php");

class ProductoController
{
    private $model;

    public function __construct($conexion)
    {
        $this->model = new Producto($conexion);
    }

    public function listar($queryParams = [])
    {
        $busqueda = isset($queryParams['busqueda']) ? trim($queryParams['busqueda']) : "";
        $categoria = isset($queryParams['categoria']) ? trim($queryParams['categoria']) : "";
        $proveedorId = isset($queryParams['idProveedor']) ? trim($queryParams['idProveedor']) : null;

        $productos = $this->model->listar($busqueda, $categoria, $proveedorId);
        return [
            "success" => true,
            "data" => $productos
        ];
    }

    public function buscarPorId($id)
    {
        $id = intval($id);
        if ($id <= 0) {
            return [
                "success" => false,
                "errorCode" => "INVALID_ID",
                "message" => "ID de producto inválido."
            ];
        }

        $producto = $this->model->buscarPorId($id);
        if (!$producto) {
            return [
                "success" => false,
                "errorCode" => "NOT_FOUND",
                "message" => "Producto no encontrado."
            ];
        }
        return [
            "success" => true,
            "data" => $producto
        ];
    }

    public function guardar($datos)
    {
        if (!is_object($datos)) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Datos inválidos."
            ];
        }

        $idProveedor = isset($datos->idProveedor) ? intval($datos->idProveedor) : null;
        $nombreProducto = isset($datos->nombreProducto) ? trim($datos->nombreProducto) : "";
        $codigoSKU = isset($datos->codigoSKU) ? trim($datos->codigoSKU) : "";
        $stock = isset($datos->stock) ? $datos->stock : 0;

        if (!esEntero($stock)) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "El stock debe ser un número entero."
            ];
        }

        $stock = (int) $stock;
        $precioUnitario = isset($datos->precioUnitario) ? floatval($datos->precioUnitario) : 0.0;
        $precioCompra = null;
        if (isset($datos->precioCompra) && trim((string) $datos->precioCompra) !== "") {
            $precioCompra = floatval($datos->precioCompra);
        }
        $categoria = isset($datos->categoria) && !empty($datos->categoria) ? trim($datos->categoria) : "General";
        $imagen = isset($datos->imagen) ? trim($datos->imagen) : null;
        $fechaVencimiento = isset($datos->fechaVencimiento) && !empty($datos->fechaVencimiento) ? $datos->fechaVencimiento : date("Y-m-d", strtotime("+5 years"));
        $descripcion = isset($datos->descripcion) ? trim($datos->descripcion) : "";

        if ($nombreProducto === "" || $codigoSKU === "") {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "El nombre del producto y el SKU son requeridos."
            ];
        }

        if (!$idProveedor || $idProveedor <= 0) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Debes seleccionar un proveedor."
            ];
        }

        if ($precioUnitario < 0 || $stock < 0) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "El precio y el stock no pueden ser negativos."
            ];
        }

        if ($this->model->buscarPorSku($codigoSKU)) {
            return [
                "success" => false,
                "errorCode" => "DUPLICATE_CODE",
                "message" => "El código SKU ya está en uso."
            ];
        }

        $resultado = $this->model->crear($idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion);

        if ($resultado === true) {
            return [
                "success" => true,
                "message" => "Producto guardado con éxito."
            ];
        }

        if (is_string($resultado)) {
            return $this->respuestaPorErrorModelo($resultado, "guardar el producto");
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible guardar el producto. Inténtalo nuevamente."
        ];
    }

    public function actualizar($datos)
    {
        $id = isset($datos->idProducto) ? intval($datos->idProducto) : 0;
        if ($id <= 0) {
            return [
                "success" => false,
                "errorCode" => "INVALID_ID",
                "message" => "ID de producto inválido."
            ];
        }

        $productoActual = $this->model->buscarPorId($id);
        $imagenAnterior = $productoActual ? ($productoActual['imagen'] ?? '') : '';
        $precioCompraAnterior = $productoActual ? ($productoActual['precioCompra'] ?? null) : null;

        $idProveedor = isset($datos->idProveedor) ? intval($datos->idProveedor) : null;
        $nombreProducto = isset($datos->nombreProducto) ? trim($datos->nombreProducto) : "";
        $codigoSKU = isset($datos->codigoSKU) ? trim($datos->codigoSKU) : "";
        $stock = isset($datos->stock) ? $datos->stock : 0;

        if (!esEntero($stock)) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "El stock debe ser un número entero."
            ];
        }

        $stock = (int) $stock;
        $precioUnitario = isset($datos->precioUnitario) ? floatval($datos->precioUnitario) : 0.0;
        $precioCompra = $precioCompraAnterior;
        if (isset($datos->precioCompra) && trim((string) $datos->precioCompra) !== "") {
            $precioCompra = floatval($datos->precioCompra);
        }
        $categoria = isset($datos->categoria) && !empty($datos->categoria) ? trim($datos->categoria) : "General";
        $imagen = isset($datos->imagen) ? trim($datos->imagen) : null;
        $fechaVencimiento = isset($datos->fechaVencimiento) && !empty($datos->fechaVencimiento) ? $datos->fechaVencimiento : date("Y-m-d", strtotime("+5 years"));
        $descripcion = isset($datos->descripcion) ? trim($datos->descripcion) : "";

        if ($nombreProducto === "" || $codigoSKU === "") {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "El nombre del producto y el SKU son requeridos."
            ];
        }

        if (!$idProveedor || $idProveedor <= 0) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "Debes seleccionar un proveedor."
            ];
        }

        if ($precioUnitario < 0 || $stock < 0) {
            return [
                "success" => false,
                "errorCode" => "VALIDATION_ERROR",
                "message" => "El precio y el stock no pueden ser negativos."
            ];
        }

        $existente = $this->model->buscarPorSku($codigoSKU);
        if ($existente && intval($existente['idProducto']) !== $id) {
            return [
                "success" => false,
                "errorCode" => "DUPLICATE_CODE",
                "message" => "El código SKU ya está en uso."
            ];
        }

        $resultado = $this->model->actualizar($id, $idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion);

        if ($resultado === true) {
            /*
             * Imágenes huérfanas: si la imagen cambió (o se quitó),
             * eliminar el archivo anterior una vez guardado el cambio.
             */
            if ($imagenAnterior !== '' && $imagenAnterior !== $imagen) {
                eliminarImagenProducto($imagenAnterior);
            }

            return [
                "success" => true,
                "message" => "Producto actualizado con éxito."
            ];
        }

        if (is_string($resultado)) {
            return $this->respuestaPorErrorModelo($resultado, "actualizar el producto");
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible actualizar el producto. Inténtalo nuevamente."
        ];
    }

    public function eliminar($id)
    {
        $id = intval($id);
        if ($id <= 0) {
            return [
                "success" => false,
                "errorCode" => "INVALID_ID",
                "message" => "ID inválido."
            ];
        }

        $producto = $this->model->buscarPorId($id);

        $resultado = $this->model->eliminar($id);

        if ($resultado === true) {
            if ($producto && !empty($producto['imagen'])) {
                eliminarImagenProducto($producto['imagen']);
            }

            return [
                "success" => true,
                "message" => "Producto eliminado correctamente."
            ];
        }

        if (is_string($resultado)) {
            return $this->respuestaPorErrorModelo($resultado, "eliminar el producto");
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible eliminar el producto. Inténtalo nuevamente."
        ];
    }

    private function respuestaPorErrorModelo($errorCode, $accion)
    {
        if ($errorCode === 'DUPLICATE_CODE') {
            return [
                "success" => false,
                "errorCode" => $errorCode,
                "message" => "El código SKU ya está en uso."
            ];
        }

        if ($errorCode === 'FOREIGN_KEY_CONSTRAINT') {
            if (strpos($accion, 'eliminar') === 0) {
                return [
                    "success" => false,
                    "errorCode" => $errorCode,
                    "message" => "No se puede " . $accion . " porque tiene facturas u otros registros asociados."
                ];
            }

            return [
                "success" => false,
                "errorCode" => $errorCode,
                "message" => "No se puede " . $accion . ". Verifica que el proveedor seleccionado sea válido."
            ];
        }

        return [
            "success" => false,
            "errorCode" => "DATABASE_ERROR",
            "message" => "No fue posible " . $accion . ". Inténtalo nuevamente."
        ];
    }
}