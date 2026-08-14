import { useEffect, useMemo, useState } from "react";

import {
    listarProductos,
    eliminarProducto
} from "../services/productoService";

import { API_BASE_URL } from "../services/api";


// =====================================================
// COMPONENTE PARA MOSTRAR IMAGEN
// =====================================================

function ImagenProducto({ src, alt }) {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div
                className="d-flex align-items-center justify-content-center bg-light text-secondary"
                style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "8px",
                    border: "1px solid #dee2e6"
                }}
                title="Sin imagen disponible"
            >
                <i className="bi bi-box-seam fs-3"></i>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt || "Producto"}
            width="64"
            height="64"
            style={{
                width: "64px",
                height: "64px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #dee2e6"
            }}
            onError={() => setError(true)}
        />
    );
}


// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

function ProductoList({
    editar,
    actualizar,
    onNuevo
}) {

    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);


    // =====================================================
    // URL BASE DEL BACKEND
    // =====================================================

    const API_ORIGIN = useMemo(() => {
        try {
            return new URL(API_BASE_URL).origin;
        } catch {
            return `${window.location.protocol}//${window.location.hostname}:8000`;
        }
    }, []);


    // =====================================================
    // CONSTRUIR URL DE IMAGEN
    // =====================================================

    const obtenerUrlImagen = (imagen) => {

        if (!imagen) {
            return null;
        }

        const valor = String(imagen).trim();

        if (!valor) {
            return null;
        }

        // URL externa
        if (
            valor.startsWith("http://") ||
            valor.startsWith("https://") ||
            valor.startsWith("data:image/")
        ) {
            return valor;
        }

        // Ruta absoluta
        if (valor.startsWith("/")) {
            return `${API_ORIGIN}${valor}`;
        }

        // Ruta relativa ./...
        if (valor.startsWith("./")) {
            return `${API_ORIGIN}/${valor.substring(2)}`;
        }

        // Ruta relativa normal
        return `${API_ORIGIN}/${valor}`;
    };


    // =====================================================
    // CARGAR PRODUCTOS
    // =====================================================

    const cargarProductos = async () => {

        try {

            setCargando(true);

            const res = await listarProductos();

            if (res && res.success) {

                setProductos(
                    Array.isArray(res.data)
                        ? res.data
                        : []
                );

            } else {

                setProductos([]);

                if (res?.message) {
                    console.warn(
                        "No se pudieron cargar los productos:",
                        res.message
                    );
                }

            }

        } catch (error) {

            console.error(
                "Error al obtener productos:",
                error
            );

            setProductos([]);

        } finally {

            setCargando(false);

        }

    };


    useEffect(() => {
        cargarProductos();
    }, [actualizar]);


    // =====================================================
    // BUSQUEDA
    // =====================================================

    const productosFiltrados = useMemo(() => {

        const termino =
            busqueda.trim().toLowerCase();

        if (!termino) {
            return productos;
        }

        return productos.filter((producto) => {

            const nombre =
                String(
                    producto.nombreProducto || ""
                ).toLowerCase();

            const sku =
                String(
                    producto.codigoSKU || ""
                ).toLowerCase();

            const categoria =
                String(
                    producto.categoria || ""
                ).toLowerCase();

            const proveedor =
                String(
                    producto.nombreProveedor ||
                    producto.proveedor ||
                    ""
                ).toLowerCase();

            const id =
                String(
                    producto.idProducto || ""
                ).toLowerCase();

            return (
                nombre.includes(termino) ||
                sku.includes(termino) ||
                categoria.includes(termino) ||
                proveedor.includes(termino) ||
                id.includes(termino)
            );

        });

    }, [productos, busqueda]);


    // =====================================================
    // ELIMINAR
    // =====================================================

    const eliminar = async (
        id,
        nombre
    ) => {

        const confirmar = window.confirm(
            `¿Está seguro de eliminar el producto "${nombre}"?`
        );

        if (!confirmar) {
            return;
        }

        try {

            const res =
                await eliminarProducto(id);

            if (res && res.success) {

                alert(
                    "Producto eliminado correctamente."
                );

                await cargarProductos();

            } else {

                alert(
                    res?.message ||
                    "No se pudo eliminar el producto."
                );

            }

        } catch (error) {

            console.error(
                "Error al eliminar producto:",
                error
            );

            alert(
                "Error al eliminar el producto."
            );

        }

    };


    // =====================================================
    // FORMATO MONEDA
    // =====================================================

    const formatoMoneda = (valor) => {

        const numero = Number(valor);

        if (Number.isNaN(numero)) {
            return "$ 0.00";
        }

        return numero.toLocaleString(
            "es-CO",
            {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 2
            }
        );

    };


    // =====================================================
    // ESTADO DEL STOCK
    // =====================================================

    const obtenerEstadoStock = (stock) => {

        const cantidad =
            Number(stock) || 0;

        if (cantidad <= 0) {

            return {
                clase: "bg-danger",
                texto: "Sin stock"
            };

        }

        if (cantidad <= 5) {

            return {
                clase: "bg-warning text-dark",
                texto: "Stock bajo"
            };

        }

        return {
            clase: "bg-success",
            texto: "Disponible"
        };

    };


    // =====================================================
    // FORMATO FECHA
    // =====================================================

    const formatearFecha = (fecha) => {

        if (!fecha) {
            return "-";
        }

        const valor =
            String(fecha).trim();

        if (
            valor === "0000-00-00" ||
            valor === "0000-00-00 00:00:00"
        ) {
            return "-";
        }

        const partes =
            valor
                .split(" ")[0]
                .split("-");

        if (partes.length === 3) {

            return `${partes[2]}/${partes[1]}/${partes[0]}`;

        }

        return valor;

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="card shadow-sm border-0">

            {/* CABECERA */}

            <div className="card-header bg-white py-3">

                <div className="row g-3 align-items-center">

                    <div className="col-12 col-lg-5">

                        <h5 className="fw-bold mb-0 text-dark">

                            <i className="bi bi-box-seam text-warning me-2"></i>

                            Inventario de Productos (
                            {productosFiltrados.length}
                            )

                        </h5>

                    </div>


                    <div className="col-12 col-lg-7">

                        <div className="d-flex flex-wrap gap-2 justify-content-lg-end">

                            <div
                                className="input-group"
                                style={{
                                    maxWidth: "360px"
                                }}
                            >

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar producto, SKU, categoría..."
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(
                                            e.target.value
                                        )
                                    }
                                />

                                <span className="input-group-text bg-white">

                                    <i className="bi bi-search text-muted"></i>

                                </span>

                            </div>


                            <button
                                type="button"
                                className="btn btn-warning text-dark fw-bold"
                                onClick={onNuevo}
                            >

                                <i className="bi bi-plus-lg me-1"></i>

                                Nuevo Producto

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* CONTENIDO */}

            <div className="card-body p-0">

                {cargando ? (

                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-warning"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Cargando...
                            </span>
                        </div>

                        <p className="mt-2 text-muted mb-0">
                            Cargando productos...
                        </p>

                    </div>

                ) : productosFiltrados.length === 0 ? (

                    <div className="text-center py-5 text-muted">

                        <i className="bi bi-box-seam fs-1 d-block mb-2"></i>

                        {busqueda.trim()
                            ? "No se encontraron productos con esa búsqueda."
                            : "No hay productos registrados en el inventario."
                        }

                        {!busqueda.trim() && (

                            <div className="mt-3">

                                <button
                                    type="button"
                                    className="btn btn-warning text-dark fw-bold"
                                    onClick={onNuevo}
                                >

                                    <i className="bi bi-plus-lg me-1"></i>

                                    Registrar primer producto

                                </button>

                            </div>

                        )}

                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th>ID</th>

                                    <th>Imagen</th>

                                    <th>Producto</th>

                                    <th>SKU</th>

                                    <th>Categoría</th>

                                    <th>Proveedor</th>

                                    <th className="text-center">
                                        Stock
                                    </th>

                                    <th>
                                        Precio Compra
                                    </th>

                                    <th>
                                        Precio Venta
                                    </th>

                                    <th>
                                        Vencimiento
                                    </th>

                                    <th className="text-center">
                                        Acciones
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {productosFiltrados.map(
                                    (producto) => {

                                        const stockEstado =
                                            obtenerEstadoStock(
                                                producto.stock
                                            );

                                        const imagen =
                                            obtenerUrlImagen(
                                                producto.imagen
                                            );

                                        const proveedor =
                                            producto.nombreProveedor ||
                                            producto.proveedor ||
                                            (
                                                producto.idProveedor
                                                    ? `ID #${producto.idProveedor}`
                                                    : "-"
                                            );

                                        return (

                                            <tr
                                                key={
                                                    producto.idProducto
                                                }
                                            >

                                                {/* ID */}

                                                <td>

                                                    <span className="fw-bold text-muted">
                                                        #
                                                        {
                                                            producto.idProducto
                                                        }
                                                    </span>

                                                </td>


                                                {/* IMAGEN */}

                                                <td>

                                                    <ImagenProducto
                                                        src={imagen}
                                                        alt={
                                                            producto.nombreProducto
                                                        }
                                                    />

                                                </td>


                                                {/* PRODUCTO */}

                                                <td>

                                                    <div className="fw-semibold text-dark">

                                                        {
                                                            producto.nombreProducto ||
                                                            "-"
                                                        }

                                                    </div>

                                                    {producto.descripcion && (

                                                        <small
                                                            className="text-muted d-block"
                                                            style={{
                                                                maxWidth: "250px"
                                                            }}
                                                        >
                                                            {
                                                                producto.descripcion
                                                            }
                                                        </small>

                                                    )}

                                                </td>


                                                {/* SKU */}

                                                <td>

                                                    <code>
                                                        {
                                                            producto.codigoSKU ||
                                                            "-"
                                                        }
                                                    </code>

                                                </td>


                                                {/* CATEGORÍA */}

                                                <td>

                                                    <span className="badge bg-light text-dark border">

                                                        {
                                                            producto.categoria ||
                                                            "General"
                                                        }

                                                    </span>

                                                </td>


                                                {/* PROVEEDOR */}

                                                <td>

                                                    {
                                                        proveedor
                                                    }

                                                </td>


                                                {/* STOCK */}

                                                <td className="text-center">

                                                    <div className="fw-bold mb-1">

                                                        {
                                                            Number(
                                                                producto.stock
                                                            ) || 0
                                                        }

                                                    </div>

                                                    <span
                                                        className={`badge ${stockEstado.clase}`}
                                                    >
                                                        {
                                                            stockEstado.texto
                                                        }
                                                    </span>

                                                </td>


                                                {/* PRECIO COMPRA */}

                                                <td>

                                                    <span className="text-muted">

                                                        {
                                                            formatoMoneda(
                                                                producto.precioCompra
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* PRECIO VENTA */}

                                                <td>

                                                    <span className="fw-bold text-success">

                                                        {
                                                            formatoMoneda(
                                                                producto.precioUnitario
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* VENCIMIENTO */}

                                                <td>

                                                    <span className="text-muted">

                                                        {
                                                            formatearFecha(
                                                                producto.fechaVencimiento
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* ACCIONES */}

                                                <td className="text-center">

                                                    <div className="btn-group btn-group-sm">

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary"
                                                            onClick={() =>
                                                                editar(
                                                                    producto
                                                                )
                                                            }
                                                            title="Editar producto"
                                                        >

                                                            <i className="bi bi-pencil"></i>

                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={() =>
                                                                eliminar(
                                                                    producto.idProducto,
                                                                    producto.nombreProducto
                                                                )
                                                            }
                                                            title="Eliminar producto"
                                                        >

                                                            <i className="bi bi-trash"></i>

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* PIE */}

            {!cargando &&
                productosFiltrados.length > 0 && (

                    <div className="card-footer bg-white border-top py-3">

                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">

                            <small className="text-muted">

                                Mostrando{" "}

                                <strong>
                                    {
                                        productosFiltrados.length
                                    }
                                </strong>{" "}

                                de{" "}

                                <strong>
                                    {
                                        productos.length
                                    }
                                </strong>{" "}

                                productos.

                            </small>


                            <small className="text-muted">

                                <i className="bi bi-box-seam me-1"></i>

                                Inventario de Ferretería

                            </small>

                        </div>

                    </div>

                )}

        </div>

    );
}

export default ProductoList;