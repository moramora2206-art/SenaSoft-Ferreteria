import { useEffect, useState } from "react";
import { obtenerMetricasDashboard } from "../services/dashboardService";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user } = useAuth();
    const [metricas, setMetricas] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const cargarDashboard = async () => {
        try {
            setCargando(true);
            const res = await obtenerMetricasDashboard();
            if (res.success) {
                setMetricas(res.data);
            } else {
                setError(res.message || "Error al cargar métricas del servidor.");
            }
        } catch (err) {
            console.error(err);
            setError("No fue posible conectar con la API PHP.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDashboard();
    }, []);

    if (cargando) {
        return (
            <div className="d-flex align-items-center justify-content-center py-5">
                <div className="spinner-border text-warning me-3" role="status"></div>
                <span className="fs-5 text-muted">Cargando métricas de la Ferretería...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger shadow-sm d-flex align-items-center" role="alert">
                <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
                <div>
                    <h5 className="alert-heading mb-1">Atención</h5>
                    <p className="mb-0">{error}</p>
                    <button className="btn btn-outline-danger btn-sm mt-2" onClick={cargarDashboard}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Header del Dashboard */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold mb-1 text-dark">
                        <i className="bi bi-tools text-warning me-2"></i>
                        Panel de Control — Ferretería
                    </h2>
                    <p className="text-muted mb-0">Resumen operativo y estado del inventario en tiempo real.</p>
                </div>
                <button className="btn btn-outline-secondary btn-sm" onClick={cargarDashboard}>
                    <i className="bi bi-arrow-clockwise me-1"></i> Actualizar
                </button>
            </div>

            {/* Tarjetas de Métricas Principales */}
            <div className="row g-3 mb-4">
                {/* Ventas del Período */}
                <div className="col-6 col-md-4 col-xl-2">
                    <div className="card shadow-sm border-0 border-start border-4 border-success h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-uppercase text-muted fw-bold small">Ventas</div>
                                    <h2 className="fw-bold text-dark my-1">${Number(metricas?.totalVentas || 0).toLocaleString("es-CO")}</h2>
                                    <div className="small text-success">
                                        <i className="bi bi-cash-stack me-1"></i>Período
                                    </div>
                                </div>
                                <div className="bg-success-subtle p-3 rounded-circle text-success">
                                    <i className="bi bi-cash-stack fs-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Facturas */}
                <div className="col-6 col-md-4 col-xl-2">
                    <div className="card shadow-sm border-0 border-start border-4 border-primary h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-uppercase text-muted fw-bold small">Facturas</div>
                                    <h2 className="fw-bold text-dark my-1">{metricas?.totalFacturas || 0}</h2>
                                    <div className="small text-primary">
                                        <i className="bi bi-receipt me-1"></i>Activas
                                    </div>
                                </div>
                                <div className="bg-primary-subtle p-3 rounded-circle text-primary">
                                    <i className="bi bi-receipt fs-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Productos */}
                <div className="col-6 col-md-4 col-xl-2">
                    <div className="card shadow-sm border-0 border-start border-4 border-primary h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-uppercase text-muted fw-bold small">Productos</div>
                                    <h2 className="fw-bold text-dark my-1">{metricas?.totalProductos || 0}</h2>
                                    <div className="small text-primary">
                                        <i className="bi bi-boxes me-1"></i>En catálogo
                                    </div>
                                </div>
                                <div className="bg-primary-subtle p-3 rounded-circle text-primary">
                                    <i className="bi bi-box-seam fs-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clientes */}
                <div className="col-6 col-md-4 col-xl-2">
                    <div className="card shadow-sm border-0 border-start border-4 border-info h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-uppercase text-muted fw-bold small">Clientes</div>
                                    <h2 className="fw-bold text-dark my-1">{metricas?.totalClientes || 0}</h2>
                                    <div className="small text-info">
                                        <i className="bi bi-people me-1"></i>Registrados
                                    </div>
                                </div>
                                <div className="bg-info-subtle p-3 rounded-circle text-info">
                                    <i className="bi bi-people fs-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Proveedores */}
                <div className="col-6 col-md-4 col-xl-2">
                    <div className="card shadow-sm border-0 border-start border-4 border-warning h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-uppercase text-muted fw-bold small">Proveedores</div>
                                    <h2 className="fw-bold text-dark my-1">{metricas?.totalProveedores || 0}</h2>
                                    <div className="small text-warning fw-semibold">
                                        <i className="bi bi-truck me-1"></i>Activos
                                    </div>
                                </div>
                                <div className="bg-warning-subtle p-3 rounded-circle text-warning">
                                    <i className="bi bi-truck fs-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stock Bajo */}
                <div className="col-6 col-md-4 col-xl-2">
                    <div className="card shadow-sm border-0 border-start border-4 border-warning h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-uppercase text-muted fw-bold small">Stock Bajo</div>
                                    <h2 className="fw-bold text-dark my-1">{metricas?.stockBajo || 0}</h2>
                                    <div className="small text-danger fw-semibold">
                                        <i className="bi bi-exclamation-triangle me-1"></i>
                                        {metricas?.productosAgotados || 0} agotados
                                    </div>
                                </div>
                                <div className="bg-warning-subtle p-3 rounded-circle text-warning">
                                    <i className="bi bi-exclamation-octagon fs-2"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Accesos Rápidos */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3">
                    <h5 className="fw-bold mb-0 text-dark">
                        <i className="bi bi-lightning-charge text-warning me-2"></i>
                        Accesos Rápidos
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-6 col-md-4 col-lg-2">
                            <Link to="/productos" className="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center gap-2 shadow-sm">
                                <i className="bi bi-box-seam fs-3"></i>
                                <span className="small fw-semibold">Productos</span>
                            </Link>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2">
                            <Link to="/facturas" className="btn btn-outline-success w-100 py-3 d-flex flex-column align-items-center gap-2 shadow-sm">
                                <i className="bi bi-cart-check fs-3"></i>
                                <span className="small fw-semibold">Nueva Factura</span>
                            </Link>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2">
                            <Link to="/clientes" className="btn btn-outline-info w-100 py-3 d-flex flex-column align-items-center gap-2 shadow-sm">
                                <i className="bi bi-people fs-3"></i>
                                <span className="small fw-semibold">Clientes</span>
                            </Link>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2">
                            <Link to="/proveedores" className="btn btn-outline-warning w-100 py-3 d-flex flex-column align-items-center gap-2 text-dark shadow-sm">
                                <i className="bi bi-truck fs-3"></i>
                                <span className="small fw-semibold">Proveedores</span>
                            </Link>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2">
                            <Link to="/ventas" className="btn btn-outline-dark w-100 py-3 d-flex flex-column align-items-center gap-2 shadow-sm">
                                <i className="bi bi-graph-up-arrow fs-3"></i>
                                <span className="small fw-semibold">Análisis de Ventas</span>
                            </Link>
                        </div>
                        {user?.rol === "Administrador" && (
                            <div className="col-6 col-md-4 col-lg-2">
                                <Link to="/usuarios" className="btn btn-outline-secondary w-100 py-3 d-flex flex-column align-items-center gap-2 shadow-sm">
                                    <i className="bi bi-person-badge fs-3"></i>
                                    <span className="small fw-semibold">Usuarios</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sección Inferior: Alertas de Inventario & Últimas Ventas */}
            <div className="row g-4">
                {/* Alertas de Stock Bajo */}
                <div className="col-12 col-lg-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white py-3 d-flex align-items-center justify-content-between">
                            <h5 className="fw-bold mb-0 text-danger">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                Alertas de Inventario Critico
                            </h5>
                            <Link to="/productos" className="btn btn-sm btn-link text-decoration-none">Ver todos</Link>
                        </div>
                        <div className="card-body p-0">
                            {metricas?.alertasStock && metricas.alertasStock.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>SKU</th>
                                                <th>Producto Ferretería</th>
                                                <th>Categoría</th>
                                                <th className="text-end">Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {metricas.alertasStock.map((prod) => (
                                                <tr key={prod.idProducto}>
                                                    <td><code>{prod.codigoSKU}</code></td>
                                                    <td className="fw-semibold">{prod.nombreProducto}</td>
                                                    <td><span className="badge bg-light text-dark border">{prod.categoria}</span></td>
                                                    <td className="text-end">
                                                        {Number(prod.stock) === 0 ? (
                                                            <span className="badge bg-danger">AGOTADO ({prod.stock})</span>
                                                        ) : (
                                                            <span className="badge bg-warning text-dark">BAJO ({prod.stock})</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <i className="bi bi-check-circle fs-1 text-success d-block mb-2"></i>
                                    ¡Inventario saludable! Ningún producto con stock crítico.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Últimas Ventas */}
                <div className="col-12 col-lg-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white py-3 d-flex align-items-center justify-content-between">
                            <h5 className="fw-bold mb-0 text-success">
                                <i className="bi bi-journal-check me-2"></i>
                                Últimas Facturas Registradas
                            </h5>
                            <Link to="/facturas" className="btn btn-sm btn-link text-decoration-none">Ver todas</Link>
                        </div>
                        <div className="card-body p-0">
                            {metricas?.ultimasVentas && metricas.ultimasVentas.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th># Factura</th>
                                                <th>Cliente</th>
                                                <th>Fecha</th>
                                                <th className="text-end">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {metricas.ultimasVentas.map((f) => (
                                                <tr key={f.idFactura}>
                                                    <td><span className="fw-bold text-primary">#FAC-{f.idFactura}</span></td>
                                                    <td>{f.cliente || "Cliente Ocasional"}</td>
                                                    <td>{f.fecha}</td>
                                                    <td className="text-end fw-bold text-success">${Number(f.total).toLocaleString("es-CO")}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <i className="bi bi-receipt fs-1 text-muted d-block mb-2"></i>
                                    Aún no se han registrado ventas en el sistema.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;