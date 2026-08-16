import { useState, useEffect } from "react";
import { guardarProducto, uploadImage } from "../services/productoService";
import { listarProveedores } from "../services/proveedorService";

function ProductoForm({ recargar, cancelar }) {
    const [producto, setProducto] = useState({
        idProveedor: "",
        codigoSKU: "",
        nombreProducto: "",
        stock: "",
        precioUnitario: "",
        precioCompra: "",
        categoria: "Herramientas Manuales",
        imagen: "",
        fechaVencimiento: "2030-12-31",
        descripcion: ""
    });

    const [proveedores, setProveedores] = useState([]);
    const [guardando, setGuardando] = useState(false);

    const [imagenFile, setImagenFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = async () => {
        try {
            const res = await listarProveedores();
            if (res && res.success) {
                setProveedores(res.data || []);
            }
        } catch (e) {
            console.error("Error al cargar proveedores", e);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto((prev) => ({
            ...prev,
            [name]: value
        }));

        // If user types into imagen URL field, clear any selected file
        if (name === 'imagen' && value) {
            setImagenFile(null);
            setPreviewUrl(value);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        // Validate size (<=5MB) and type
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('El archivo excede el tamaño máximo de 5 MB');
            return;
        }
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.type)) {
            alert('Tipo de archivo no permitido. Use JPG, PNG o WEBP.');
            return;
        }
        setImagenFile(file);
        // Preview
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        // clear imagen URL field
        setProducto((prev) => ({ ...prev, imagen: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const envio = {
            ...producto,
            codigoSKU: producto.codigoSKU.trim(),
            nombreProducto: producto.nombreProducto.trim(),
            categoria: producto.categoria.trim(),
            descripcion: producto.descripcion.trim()
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
            // If a file was selected, upload it first
            if (imagenFile) {
                const res = await uploadImage(imagenFile);
                if (res && res.success && res.data && res.data.ruta) {
                    envio.imagen = res.data.ruta;
                } else {
                    alert(res.message || 'Error al subir la imagen');
                    setGuardando(false);
                    return;
                }
            }

            const resGuardar = await guardarProducto(envio);
            if (resGuardar.success) {
                alert("Producto registrado correctamente en el inventario.");
                recargar();
            } else {
                alert(resGuardar.message || "Error al guardar el producto.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión al servidor.");
        } finally {
            setGuardando(false);
        }
    };

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

    return (
        <div className="card shadow border-0 mb-4">
            <div className="card-header bg-warning text-dark py-3 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">
                    <i className="bi bi-box-seam me-2"></i>
                    Registrar Nuevo Producto de Ferretería
                </h5>
                <button type="button" className="btn-close" onClick={cancelar}></button>
            </div>

            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {/* Nombre */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Nombre del Producto <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombreProducto"
                                placeholder="Ej. Martillo de Uña 16 oz"
                                value={producto.nombreProducto}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* SKU */}
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Código / SKU <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="codigoSKU"
                                placeholder="FER-MAR-001"
                                value={producto.codigoSKU}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Categoría */}
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Categoría</label>
                            <select
                                className="form-select"
                                name="categoria"
                                value={producto.categoria}
                                onChange={handleChange}
                            >
                                {categoriasFerreteria.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Proveedor */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Proveedor</label>
                            <select
                                className="form-select"
                                name="idProveedor"
                                value={producto.idProveedor}
                                onChange={handleChange}
                            >
                                <option value="">-- Seleccionar Proveedor --</option>
                                {proveedores.map((p) => (
                                    <option key={p.idProveedor} value={p.idProveedor}>
                                        {p.nombreProveedor} (NIT: {p.nit})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Stock */}
                        <div className="col-md-2">
                            <label className="form-label fw-semibold">Existencias (Stock)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="stock"
                                min="0"
                                placeholder="0"
                                value={producto.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Precio Compra */}
                        <div className="col-md-2">
                            <label className="form-label fw-semibold">Precio Compra ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="precioCompra"
                                placeholder="0.00"
                                value={producto.precioCompra}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Precio Venta */}
                        <div className="col-md-2">
                            <label className="form-label fw-semibold">Precio Venta ($) <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="precioUnitario"
                                placeholder="0.00"
                                value={producto.precioUnitario}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Imagen URL */}
                        <div className="col-md-8">
                            <label className="form-label fw-semibold">URL de la Imagen del Producto (opcional)</label>
                            <input
                                type="url"
                                className="form-control"
                                name="imagen"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                value={producto.imagen}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Imagen File upload */}
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">O subir imagen (JPG/PNG/WEBP)</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="form-control"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Preview */}
                        {previewUrl && (
                            <div className="col-12">
                                <label className="form-label fw-semibold">Vista previa</label>
                                <div>
                                    <img src={previewUrl} alt="Preview" style={{ maxHeight: "120px", borderRadius: "6px" }} />
                                </div>
                            </div>
                        )}

                        {/* Fecha Vencimiento */}
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Fecha de Vencimiento / Garantía</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaVencimiento"
                                value={producto.fechaVencimiento}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Descripción */}
                        <div className="col-12">
                            <label className="form-label fw-semibold">Descripción del Producto</label>
                            <textarea
                                rows="2"
                                className="form-control"
                                name="descripcion"
                                placeholder="Especificaciones técnicas, medidas, materiales..."
                                value={producto.descripcion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                        <button type="button" className="btn btn-secondary" onClick={cancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-warning text-dark fw-bold" disabled={guardando}>
                            {guardando ? "Guardando..." : "Guardar Producto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductoForm;
