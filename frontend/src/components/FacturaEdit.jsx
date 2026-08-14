import { useState, useEffect } from "react";
import { buscarFactura, anularFactura } from "../services/facturaService";
/**
 * FacturaEdit — Visor de Detalle de Factura (Solo Lectura)
 *
 * Las facturas son documentos contables inmutables una vez registradas.
 * Este componente muestra el detalle completo de una factura seleccionada.
 * Para anular la venta, se puede eliminar la factura.
 */
function FacturaEdit({ facturaId, recargar, cerrar }) {
    const [factura, setFactura] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!facturaId) return;
        cargarDetalle(facturaId);
    }, [facturaId]);

    const cargarDetalle = async (id) => {
        try {
            setCargando(true);
            const res = await buscarFactura(id);
            if (res && res.success) {
                setFactura(res.data);
            }
        } catch (err) {
            console.error("Error al cargar detalle de factura", err);
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async () => {
        if (!window.confirm("¿Está seguro de eliminar esta factura? Esta acción no se puede deshacer.")) return;
        try {
            const res = await anularFactura(facturaId);
            if (res.success) {
                alert("Factura eliminada correctamente.");
                cerrar();
                recargar();
            } else {
                alert(res.message || "No se pudo eliminar la factura.");
            }
        } catch (err) {
            alert("Error al intentar eliminar la factura.");
        }
    };

    if (cargando) {
        return (
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Cargando detalle de factura...</p>
                </div>
            </div>
        );
    }

    if (!factura) return null;

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-primary text-white py-3 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">
                    <i className="bi bi-receipt-cutoff me-2"></i>
                    Factura #FAC-{factura.idFactura}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={cerrar}></button>
            </div>

            <div className="card-body p-4">
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="text-muted small fw-semibold mb-1">CLIENTE</div>
                        <div className="fw-bold">{factura.nombreCliente || `#${factura.idCliente}`}</div>
                    </div>
                    <div className="col-md-3">
                        <div className="text-muted small fw-semibold mb-1">FECHA</div>
                        <div className="fw-bold">{factura.fechaVenta}</div>
                    </div>
                    <div className="col-md-3">
                        <div className="text-muted small fw-semibold mb-1">FORMA DE PAGO</div>
                        <span className="badge bg-secondary fs-6">{factura.formaDePago}</span>
                    </div>
                    <div className="col-md-3">
                        <div className="text-muted small fw-semibold mb-1">DESCUENTO</div>
                        <div className="fw-bold">${Number(factura.descuento || 0).toLocaleString("es-CO")}</div>
                    </div>
                </div>

                {factura.observaciones && (
                    <div className="alert alert-light border mb-4">
                        <i className="bi bi-chat-left-text me-2 text-muted"></i>
                        <strong>Observaciones:</strong> {factura.observaciones}
                    </div>
                )}

                <h6 className="fw-bold text-dark mb-3">
                    <i className="bi bi-list-check me-2 text-primary"></i>
                    Productos Facturados
                </h6>

                {factura.detalles && factura.detalles.length > 0 ? (
                    <div className="table-responsive mb-4">
                        <table className="table table-bordered align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>SKU</th>
                                    <th>Producto</th>
                                    <th className="text-center">Cantidad</th>
                                    <th className="text-end">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {factura.detalles.map((d) => (
                                    <tr key={d.idDetalle}>
                                        <td><code>{d.codigoSKU}</code></td>
                                        <td className="fw-semibold">{d.nombreProducto}</td>
                                        <td className="text-center">{d.cantidad}</td>
                                        <td className="text-end fw-bold">${Number(d.subtotal).toLocaleString("es-CO")}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="table-light">
                                <tr>
                                    <td colSpan="3" className="text-end fw-bold">TOTAL</td>
                                    <td className="text-end fw-bold text-success fs-5">
                                        ${Number(factura.total).toLocaleString("es-CO")}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                ) : (
                    <div className="alert alert-warning">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        No se encontraron productos en esta factura.
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    <div className="text-muted small">
                        <i className="bi bi-info-circle me-1"></i>
                        Las facturas registradas no pueden modificarse. Elimínela si desea registrar una corrección.
                    </div>
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-outline-secondary" onClick={cerrar}>
                            <i className="bi bi-x-lg me-1"></i> Cerrar
                        </button>
                        <button type="button" className="btn btn-outline-danger" onClick={handleEliminar}>
                            <i className="bi bi-trash me-1"></i> Anular Factura
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FacturaEdit;