import { useEffect, useMemo, useState } from "react";

import {
    actualizarProducto,
    uploadImage
} from "../services/productoService";

import { listarProveedores } from "../services/proveedorService";
import { API_BASE_URL } from "../services/api";


function ProductoEdit({
    productoSeleccionado,
    recargar,
    cancelar
}) {

    const [producto, setProducto] =
        useState({
            ...productoSeleccionado
        });

    const [proveedores, setProveedores] =
        useState([]);

    const [guardando, setGuardando] =
        useState(false);

    const [imagenFile, setImagenFile] =
        useState(null);

    const [previewUrl, setPreviewUrl] =
        useState(null);


    // =====================================================
    // URL BASE DEL BACKEND
    // =====================================================

    const API_ORIGIN = useMemo(() => {

        try {

            return new URL(
                API_BASE_URL
            ).origin;

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

        const valor =
            String(imagen).trim();

        if (!valor) {
            return null;
        }

        if (
            valor.startsWith("http://") ||
            valor.startsWith("https://") ||
            valor.startsWith("data:image/")
        ) {
            return valor;
        }

        if (valor.startsWith("/")) {
            return `${API_ORIGIN}${valor}`;
        }

        if (valor.startsWith("./")) {
            return `${API_ORIGIN}/${valor.substring(2)}`;
        }

        return `${API_ORIGIN}/${valor}`;

    };


    // =====================================================
    // CARGAR PRODUCTO
    // =====================================================

    useEffect(() => {

        setProducto({
            ...productoSeleccionado
        });

        setImagenFile(null);

        const imagenInicial =
            obtenerUrlImagen(
                productoSeleccionado?.imagen
            );

        setPreviewUrl(
            imagenInicial
        );

        cargarProveedores();

    }, [productoSeleccionado]);


    // =====================================================
    // CARGAR PROVEEDORES
    // =====================================================

    const cargarProveedores = async () => {

        try {

            const res =
                await listarProveedores();

            if (res && res.success) {

                setProveedores(
                    res.data || []
                );

            }

        } catch (error) {

            console.error(
                "Error al cargar proveedores:",
                error
            );

        }

    };


    // =====================================================
    // CAMBIAR CAMPOS
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setProducto((prev) => ({
            ...prev,
            [name]: value
        }));


        // Si cambia la URL de imagen,
        // quitamos el archivo seleccionado.

        if (name === "imagen") {

            setImagenFile(null);

            setPreviewUrl(
                obtenerUrlImagen(value)
            );

        }

    };


    // =====================================================
    // SELECCIONAR ARCHIVO
    // =====================================================

    const handleFileChange = (e) => {

        const file =
            e.target.files &&
            e.target.files[0];

        if (!file) {
            return;
        }


        // Máximo 5 MB

        const maxSize =
            5 * 1024 * 1024;

        if (file.size > maxSize) {

            alert(
                "El archivo excede el tamaño máximo de 5 MB."
            );

            e.target.value = "";

            return;
        }


        // Tipos permitidos

        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowed.includes(file.type)) {

            alert(
                "Tipo de archivo no permitido. Use JPG, PNG o WEBP."
            );

            e.target.value = "";

            return;
        }


        // Guardar archivo

        setImagenFile(file);


        // Crear vista previa

        const url =
            URL.createObjectURL(file);

        setPreviewUrl(url);


        // Si se subirá archivo,
        // dejamos vacía la URL manual.

        setProducto((prev) => ({
            ...prev,
            imagen: ""
        }));

    };


    // =====================================================
    // ENVIAR FORMULARIO
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const envio = {
            ...producto,
            codigoSKU: (producto.codigoSKU || "").trim(),
            nombreProducto: (producto.nombreProducto || "").trim(),
            categoria: (producto.categoria || "").trim(),
            descripcion: (producto.descripcion || "").trim()
        };

        if (envio.nombreProducto === "" || envio.codigoSKU === "") {
            alert("El nombre del producto y el SKU son requeridos.");
            return;
        }

        if (Number(envio.precioUnitario) < 0 || Number(envio.stock) < 0) {
            alert("El precio y el stock no pueden ser negativos.");
            return;
        }

        setGuardando(true);

        try {

            // =============================================
            // SI HAY NUEVO ARCHIVO
            // =============================================

            if (imagenFile) {

                const res =
                    await uploadImage(
                        imagenFile
                    );

                if (
                    res &&
                    res.success &&
                    res.data &&
                    res.data.ruta
                ) {

                    envio.imagen =
                        res.data.ruta;

                } else {

                    alert(
                        res?.message ||
                        "Error al subir la imagen."
                    );

                    setGuardando(false);

                    return;
                }

            }


            // =============================================
            // ACTUALIZAR PRODUCTO
            // =============================================

            const res =
                await actualizarProducto(
                    envio
                );


            if (res.success) {

                alert(
                    "Producto actualizado correctamente."
                );

                recargar();

            } else {

                alert(
                    res.message ||
                    "Error al actualizar el producto."
                );

            }

        } catch (error) {

            console.error(
                "Error al actualizar producto:",
                error
            );

            alert(
                "Error al intentar actualizar el producto."
            );

        } finally {

            setGuardando(false);

        }

    };


    // =====================================================
    // CATEGORÍAS
    // =====================================================

    const categoriasFerreteria = [

        "Herramientas Manuales",
        "Herramientas Eléctricas",
        "Plomería",
        "Electricidad",
        "Pintura",
        "Fijaciones y Tornillería",
        "Materiales de Construcción",
        "General"

    ];


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="card shadow border-0 mb-4">

            {/* CABECERA */}

            <div className="card-header bg-primary text-white py-3 d-flex align-items-center justify-content-between">

                <h5 className="fw-bold mb-0">

                    <i className="bi bi-pencil-square me-2"></i>

                    Editar Producto #
                    {producto.idProducto}

                </h5>


                <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={cancelar}
                ></button>

            </div>


            <div className="card-body p-4">

                <form onSubmit={handleSubmit}>

                    <div className="row g-3">

                        {/* =================================
                            NOMBRE
                        ================================= */}

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Nombre del Producto
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="nombreProducto"
                                value={
                                    producto.nombreProducto ||
                                    ""
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* =================================
                            SKU
                        ================================= */}

                        <div className="col-md-3">

                            <label className="form-label fw-semibold">
                                SKU
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="codigoSKU"
                                value={
                                    producto.codigoSKU ||
                                    ""
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* =================================
                            CATEGORÍA
                        ================================= */}

                        <div className="col-md-3">

                            <label className="form-label fw-semibold">
                                Categoría
                            </label>

                            <select
                                className="form-select"
                                name="categoria"
                                value={
                                    producto.categoria ||
                                    "General"
                                }
                                onChange={handleChange}
                            >

                                {categoriasFerreteria.map(
                                    (cat) => (

                                        <option
                                            key={cat}
                                            value={cat}
                                        >
                                            {cat}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =================================
                            PROVEEDOR
                        ================================= */}

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Proveedor
                            </label>

                            <select
                                className="form-select"
                                name="idProveedor"
                                value={
                                    producto.idProveedor ||
                                    ""
                                }
                                onChange={handleChange}
                            >

                                <option value="">
                                    -- Seleccionar Proveedor --
                                </option>

                                {proveedores.map(
                                    (p) => (

                                        <option
                                            key={
                                                p.idProveedor
                                            }
                                            value={
                                                p.idProveedor
                                            }
                                        >

                                            {
                                                p.nombreProveedor
                                            }

                                            {" "}
                                            (NIT:{" "}
                                            {p.nit}
                                            )

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =================================
                            STOCK
                        ================================= */}

                        <div className="col-md-2">

                            <label className="form-label fw-semibold">
                                Existencias (Stock)
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                name="stock"
                                min="0"
                                value={
                                    producto.stock || 0
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* =================================
                            PRECIO COMPRA
                        ================================= */}

                        <div className="col-md-2">

                            <label className="form-label fw-semibold">
                                Precio Compra ($)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="precioCompra"
                                value={
                                    producto.precioCompra ||
                                    ""
                                }
                                onChange={handleChange}
                            />

                        </div>


                        {/* =================================
                            PRECIO VENTA
                        ================================= */}

                        <div className="col-md-2">

                            <label className="form-label fw-semibold">
                                Precio Venta ($)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="precioUnitario"
                                value={
                                    producto.precioUnitario ||
                                    0
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* =================================
                            URL IMAGEN
                        ================================= */}

                        <div className="col-md-8">

                            <label className="form-label fw-semibold">
                                URL de la Imagen
                            </label>

                            <input
                                type="url"
                                className="form-control"
                                name="imagen"
                                value={
                                    producto.imagen ||
                                    ""
                                }
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />

                            <div className="form-text">
                                Puede mantener la imagen actual o ingresar una nueva URL.
                            </div>

                        </div>


                        {/* =================================
                            SUBIR IMAGEN
                        ================================= */}

                        <div className="col-md-4">

                            <label className="form-label fw-semibold">
                                O reemplazar imagen
                            </label>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="form-control"
                                onChange={
                                    handleFileChange
                                }
                            />

                            <div className="form-text">
                                JPG, PNG o WEBP. Máximo 5 MB.
                            </div>

                        </div>


                        {/* =================================
                            VISTA PREVIA
                        ================================= */}

                        <div className="col-12">

                            <label className="form-label fw-semibold">
                                Vista previa
                            </label>

                            {previewUrl ? (

                                <div
                                    className="border rounded p-3 bg-light d-flex align-items-center gap-3"
                                    style={{
                                        minHeight: "150px"
                                    }}
                                >

                                    <img
                                        src={previewUrl}
                                        alt={
                                            producto.nombreProducto ||
                                            "Vista previa"
                                        }
                                        style={{
                                            width: "140px",
                                            height: "140px",
                                            objectFit: "contain",
                                            borderRadius: "8px",
                                            border: "1px solid #dee2e6",
                                            backgroundColor: "#fff"
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";

                                            const mensaje =
                                                e.currentTarget
                                                    .parentElement
                                                    .querySelector(
                                                        ".imagen-error"
                                                    );

                                            if (mensaje) {
                                                mensaje.style.display =
                                                    "flex";
                                            }
                                        }}
                                    />

                                    <div
                                        className="imagen-error align-items-center justify-content-center text-muted"
                                        style={{
                                            display: "none",
                                            width: "140px",
                                            height: "140px"
                                        }}
                                    >

                                        <div className="text-center">

                                            <i className="bi bi-image fs-1 d-block"></i>

                                            <small>
                                                No se pudo cargar la imagen
                                            </small>

                                        </div>

                                    </div>

                                    <div>

                                        <div className="fw-semibold">
                                            {imagenFile
                                                ? "Nueva imagen seleccionada"
                                                : "Imagen actual"}
                                        </div>

                                        <small className="text-muted">
                                            {imagenFile
                                                ? imagenFile.name
                                                : "Vista previa del producto"}
                                        </small>

                                    </div>

                                </div>

                            ) : (

                                <div
                                    className="border rounded p-4 bg-light text-center text-muted"
                                >

                                    <i className="bi bi-image fs-1 d-block mb-2"></i>

                                    No hay una imagen disponible.

                                </div>

                            )}

                        </div>


                        {/* =================================
                            FECHA
                        ================================= */}

                        <div className="col-md-4">

                            <label className="form-label fw-semibold">
                                Fecha Vencimiento
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                name="fechaVencimiento"
                                value={
                                    producto.fechaVencimiento ||
                                    ""
                                }
                                onChange={handleChange}
                            />

                        </div>


                        {/* =================================
                            DESCRIPCIÓN
                        ================================= */}

                        <div className="col-12">

                            <label className="form-label fw-semibold">
                                Descripción
                            </label>

                            <textarea
                                rows="2"
                                className="form-control"
                                name="descripcion"
                                value={
                                    producto.descripcion ||
                                    ""
                                }
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    {/* =====================================
                        BOTONES
                    ===================================== */}

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelar}
                        >
                            Cancelar
                        </button>


                        <button
                            type="submit"
                            className="btn btn-primary fw-bold"
                            disabled={guardando}
                        >

                            {guardando ? (

                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                    ></span>

                                    Guardando...

                                </>

                            ) : (

                                <>
                                    <i className="bi bi-check-lg me-1"></i>
                                    Actualizar Producto
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default ProductoEdit;