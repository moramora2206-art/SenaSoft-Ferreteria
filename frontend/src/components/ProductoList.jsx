import { useEffect, useState } from "react";
import { listarProductos, eliminarProducto } from "../services/productoService";
import { API_BASE_URL } from "../services/api";

function ProductoList({ editar, actualizar, onNuevo }) {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("");
    const [cargando, setCargando] = useState(true);

    const cargarProductos = async () => {
        try {
            setCargando(true);
            const respuesta = await listarProductos(busqueda, categoria);
            if (respuesta && respuesta.success) {
                setProductos(respuesta.data || []);
            }
        } catch (error) {
            console.error("Error al cargar productos", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, [actualizar, categoria]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        cargarProductos();
    };

    const eliminar = async (id, nombre) => {
        if (!window.confirm(`¿Está seguro de eliminar el producto "${nombre}"?`)) return;

        try {
            const res = await eliminarProducto(id);
            if (res.success) {
                alert("Producto eliminado correctamente");
                cargarProductos();
            } else {
                alert(res.message || "No se pudo eliminar el producto");
            }
        } catch (err) {
            alert("Error al intentar eliminar el producto");
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

    const buildImageUrl = (imagen) => {
        if (!imagen) return null;
        if (imagen.startsWith("http://") || imagen.startsWith("https://")) return imagen;
        // imagen is relative like uploads/productos/xxx.jpg
        // API_BASE_URL usually ends with /api -> public base is without /api
        try {
            const publicBase = API_BASE_URL.replace(/\/api\/?$/, "");
            return `${publicBase}/${imagen}`.replace(/([^:]?)\/\//g, "$1/");
        } catch (e) {
            return imagen;
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
                <div className="row g-3 align-items-center">
                    <div className="col-12 col-md-4">
                        <h5 className="fw-bold mb-0 text-dark">
                            <i className="bi bi-box-seam text-warning me-2"></i>
                            Inventario de Productos ({productos.length})
                        </h5>
                    </div>

                    <div className="col-12 col-md-8">
                        <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                            <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Buscar por nombre, SKU..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                                <button type="submit" className="btn btn-sm btn-outline-secondary">
                                    <i className="bi bi-search"></i>
                                </button>
                            </form>

                            <select
                                className="form-select form-select-sm"
                                style={{ maxWidth: "200px" }}
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                            >
                                <option value="">Todas las categorías</option>
                                {categoriasFerreteria.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <button className="btn btn-sm btn-warning text-dark fw-bold" onClick={onNuevo}>
                                <i className="bi bi-plus-lg me-1"></i> Nuevo Producto
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-body p-0">
                {cargando ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-warning" role="status"></div>
                        <p className="mt-2 text-muted">Cargando inventario...</p>
                    </div>
                ) : productos.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                        No se encontraron productos registrados.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Imagen</th>
                                    <th>SKU</th>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Proveedor</th>
                                    <th className="text-end">P. Compra</th>
                                    <th className="text-end">P. Venta</th>
                                    <th className="text-center">Stock</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((p) => {
                                    const stockNum = Number(p.stock);
                                    let stockBadge = <span className="badge bg-success">Disponible ({p.stock})</span>;
                                    if (stockNum === 0) {
                                        stockBadge = <span className="badge bg-danger">Agotado ({p.stock})</span>;
                                    } else if (stockNum < 10) {
                                        stockBadge = <span className="badge bg-warning text-dark">Stock Bajo ({p.stock})</span>;
                                    }

                                    const imageSrc = buildImageUrl(p.imagen);

                                    return (
                                        <tr key={p.idProducto}>
                                            <td style={{ width: "60px" }}>
                                                {imageSrc ? (
                                                    <img
                                                        src={imageSrc}
                                                        alt={p.nombreProducto}
                                                        className="rounded border"
                                                        style={{ width: "45px", height: "45px", objectFit: "cover" }}
                                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=100"; }}
                                                    />
                                                ) : (
                                                    <div className="bg-light rounded border d-flex align-items-center justify-content-center text-muted" style={{ width: "45px", height: "45px" }}>
                                                        <i className="bi bi-tools fs-5"></i>
                                                    </div>
                                                )}
                                            </td>

                                            <td>
                                                <code className="fw-bold text-dark">{p.codigoSKU}</code>
                                            </td>

                                            <td>
                                                <div className="fw-semibold text-dark">{p.nombreProducto}</div>
                                                {p.descripcion && <small className="text-muted text-truncate d-block" style={{ maxWidth: "220px" }}>{p.descripcion}</small>}
                                            </td>

                                            <td>
                                                <span className="badge bg-secondary-subtle text-secondary border">
                                                    {p.categoria || "General"}
                                                </span>
                                            </td>

                                            <td>
                                                <small className="text-muted">{p.nombreProveedor || "Sin Proveedor"}</small>
                                            </td>

                                            <td className="text-end text-muted small">
                                                {p.precioCompra ? `$${Number(p.precioCompra).toLocaleString("es-CO")}` : "-"}
                                            </td>

                                            <td className="text-end fw-bold text-success">
                                                ${Number(p.precioUnitario).toLocaleString("es-CO")}
                                            </td>

                                            <td className="text-center">{stockBadge}</td>

                                            <td className="text-center">
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => editar(p)}
                                                        title="Editar producto"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => eliminar(p.idProducto, p.nombreProducto)}
                                                        title="Eliminar producto"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductoList;
