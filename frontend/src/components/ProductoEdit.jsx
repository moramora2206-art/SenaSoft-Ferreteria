import { useState, useEffect } from "react";
import { actualizarProducto } from "../services/productoService";
import { listarProveedores } from "../services/proveedorService";

function ProductoEdit({ productoSeleccionado, recargar, cancelar }) {
    const [producto, setProducto] = useState({ ...productoSeleccionado });
    const [proveedores, setProveedores] = useState([]);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        setProducto({ ...productoSeleccionado });
        cargarProveedores();
    }, [productoSeleccionado]);

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
        setProducto({
            ...producto,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGuardando(true);

        try {
            const res = await actualizarProducto(producto);
            if (res.success) {
                alert("Producto actualizado correctamente.");
                recargar();
            } else {
                alert(res.message || "Error al actualizar el producto.");
            }
        } catch (error) {
            console.error(error);
            alert("Error al intentar actualizar el producto.");
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
            <div className="card-header bg-primary text-white py-3 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Producto #{producto.idProducto}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={cancelar}></button>
            </div>

            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Nombre del Producto</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombreProducto"
                                value={producto.nombreProducto || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-semibold">SKU</label>
                            <input
                                type="text"
                                className="form-control"
                                name="codigoSKU"
                                value={producto.codigoSKU || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Categoría</label>
                            <select
                                className="form-select"
                                name="categoria"
                                value={producto.categoria || "General"}
                                onChange={handleChange}
                            >
                                {categoriasFerreteria.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Proveedor</label>
                            <select
                                className="form-select"
                                name="idProveedor"
                                value={producto.idProveedor || ""}
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

                        <div className="col-md-2">
                            <label className="form-label fw-semibold">Existencias (Stock)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="stock"
                                value={producto.stock || 0}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label fw-semibold">Precio Compra ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="precioCompra"
                                value={producto.precioCompra || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label fw-semibold">Precio Venta ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="precioUnitario"
                                value={producto.precioUnitario || 0}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-8">
                            <label className="form-label fw-semibold">URL Imagen</label>
                            <input
                                type="url"
                                className="form-control"
                                name="imagen"
                                value={producto.imagen || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Fecha Vencimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaVencimiento"
                                value={producto.fechaVencimiento || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Descripción</label>
                            <textarea
                                rows="2"
                                className="form-control"
                                name="descripcion"
                                value={producto.descripcion || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                        <button type="button" className="btn btn-secondary" onClick={cancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary fw-bold" disabled={guardando}>
                            {guardando ? "Guardando..." : "Actualizar Producto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductoEdit;