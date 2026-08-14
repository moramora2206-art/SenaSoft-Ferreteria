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
        $producto = $this->model->buscarPorId($id);
        if (!$producto) {
            return [
                "success" => false,
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
        if (empty($datos->nombreProducto) || empty($datos->codigoSKU)) {
            return [
                "success" => false,
                "message" => "El nombre del producto y el SKU son requeridos."
            ];
        }

        $idProveedor = isset($datos->idProveedor) ? intval($datos->idProveedor) : null;
        $nombreProducto = trim($datos->nombreProducto);
        $codigoSKU = trim($datos->codigoSKU);
        $stock = isset($datos->stock) ? intval($datos->stock) : 0;
        $precioUnitario = isset($datos->precioUnitario) ? floatval($datos->precioUnitario) : 0.0;
        $precioCompra = isset($datos->precioCompra) ? floatval($datos->precioCompra) : null;
        $categoria = isset($datos->categoria) && !empty($datos->categoria) ? trim($datos->categoria) : "General";
        $imagen = isset($datos->imagen) ? trim($datos->imagen) : null;
        $fechaVencimiento = isset($datos->fechaVencimiento) && !empty($datos->fechaVencimiento) ? $datos->fechaVencimiento : date("Y-m-d", strtotime("+5 years"));
        $descripcion = isset($datos->descripcion) ? trim($datos->descripcion) : "";

        $ok = $this->model->crear($idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion);

        if ($ok) {
            return [
                "success" => true,
                "message" => "Producto guardado con éxito."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo guardar el producto."
        ];
    }

    public function actualizar($datos)
    {
        $id = isset($datos->idProducto) ? intval($datos->idProducto) : 0;
        if ($id <= 0) {
            return [
                "success" => false,
                "message" => "ID de producto inválido."
            ];
        }

        $idProveedor = isset($datos->idProveedor) ? intval($datos->idProveedor) : null;
        $nombreProducto = trim($datos->nombreProducto);
        $codigoSKU = trim($datos->codigoSKU);
        $stock = isset($datos->stock) ? intval($datos->stock) : 0;
        $precioUnitario = isset($datos->precioUnitario) ? floatval($datos->precioUnitario) : 0.0;
        $precioCompra = isset($datos->precioCompra) ? floatval($datos->precioCompra) : null;
        $categoria = isset($datos->categoria) && !empty($datos->categoria) ? trim($datos->categoria) : "General";
        $imagen = isset($datos->imagen) ? trim($datos->imagen) : null;
        $fechaVencimiento = isset($datos->fechaVencimiento) && !empty($datos->fechaVencimiento) ? $datos->fechaVencimiento : date("Y-m-d", strtotime("+5 years"));
        $descripcion = isset($datos->descripcion) ? trim($datos->descripcion) : "";

        $ok = $this->model->actualizar($id, $idProveedor, $nombreProducto, $codigoSKU, $stock, $precioUnitario, $precioCompra, $categoria, $imagen, $fechaVencimiento, $descripcion);

        if ($ok) {
            return [
                "success" => true,
                "message" => "Producto actualizado con éxito."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo actualizar el producto."
        ];
    }

    public function eliminar($id)
    {
        $id = intval($id);
        if ($id <= 0) {
            return [
                "success" => false,
                "message" => "ID inválido."
            ];
        }

        $ok = $this->model->eliminar($id);
        if ($ok) {
            return [
                "success" => true,
                "message" => "Producto eliminado correctamente."
            ];
        }

        return [
            "success" => false,
            "message" => "No se pudo eliminar el producto. Compruebe si está asociado a facturas."
        ];
    }
}
