import { useEffect, useState } from "react";

import { guardarFactura } from "../services/facturaService";
import { listarClientes } from "../services/clienteService";
import { listarProductos } from "../services/productoService";
import { useAuth } from "../context/AuthContext";

function FacturaForm({ recargar, cancelar }) {
    const { user } = useAuth();

    const [clientes, setClientes] = useState([]);
    const [guardando, setGuardando] = useState(false);
    const [nombreCliente, setNombreCliente] = useState("");

    const [termino, setTermino] = useState("");
    const [resultados, setResultados] = useState([]);
    const [buscandoProductos, setBuscandoProductos] = useState(false);

    const hoyFecha =
        new Date().toISOString().split("T")[0];

    const [factura, setFactura] = useState({
        idCliente: "",
        formaDePago: "Efectivo",
        descuento: 0,
        observaciones: "",
        detalles: []
    });

    const [detalle, setDetalle] = useState({
        idProducto: "",
        nombreProducto: "",
        cantidad: 1,
        precioUnitario: 0,
        stock: 0
    });

    useEffect(() => {
        cargarClientes();
    }, []);

    // Búsqueda de productos con retardo (debounce)
    useEffect(() => {
        const terminoLimpio = termino.trim();

        if (!terminoLimpio) {
            setResultados([]);
            return;
        }

        const timer = setTimeout(async () => {
            setBuscandoProductos(true);

            try {
                const respuesta =
                    await listarProductos(terminoLimpio);

                const lista = Array.isArray(respuesta?.data)
                    ? respuesta.data
                    : Array.isArray(respuesta)
                        ? respuesta
                        : [];

                setResultados(lista);
            } catch (error) {
                console.error("Error buscando productos:", error);
                setResultados([]);
            } finally {
                setBuscandoProductos(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [termino]);

    const cargarClientes = async () => {
        try {
            const respuesta = await listarClientes();

            if (Array.isArray(respuesta)) {
                setClientes(respuesta);
            } else if (
                respuesta?.success &&
                Array.isArray(respuesta.data)
            ) {
                setClientes(respuesta.data);
            } else {
                setClientes([]);
            }
        } catch (error) {
            console.error("Error cargando clientes:", error);
            setClientes([]);
        }
    };

    const seleccionarCliente = (id) => {
        const cliente = clientes.find(
            (c) => String(c.idCliente) === String(id)
        );

        if (cliente) {
            setNombreCliente(
                `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim()
            );
        } else {
            setNombreCliente("");
        }

        setFactura((prev) => ({
            ...prev,
            idCliente: id
        }));
    };

    const seleccionarResultado = (id) => {
        if (!id) {
            setDetalle((prev) => ({
                ...prev,
                idProducto: "",
                nombreProducto: "",
                precioUnitario: 0,
                stock: 0
            }));
            return;
        }

        const producto = resultados.find(
            (p) => String(p.idProducto) === String(id)
        );

        if (!producto) return;

        setDetalle({
            idProducto: String(producto.idProducto),
            nombreProducto:
                producto.nombreProducto || "",
            cantidad: 1,
            precioUnitario: Number(
                producto.precioUnitario ?? 0
            ),
            stock: Number(
                producto.stock ?? 0
            )
        });
    };

    const cambiarCantidad = (valor) => {
        const cantidad = Number(valor);

        setDetalle((prev) => ({
            ...prev,
            cantidad: cantidad > 0 ? cantidad : 1
        }));
    };

    const agregarDetalle = () => {
        if (!detalle.idProducto) {
            alert("Seleccione un producto.");
            return;
        }

        if (!detalle.nombreProducto) {
            alert("Primero consulte un producto válido.");
            return;
        }

        if (detalle.cantidad <= 0) {
            alert("La cantidad debe ser mayor que cero.");
            return;
        }

        if (detalle.stock <= 0) {
            alert("El producto no tiene stock disponible.");
            return;
        }

        if (detalle.cantidad > detalle.stock) {
            alert(
                `Stock insuficiente. Disponible: ${detalle.stock}`
            );
            return;
        }

        const productoExistente = factura.detalles.find(
            (d) =>
                String(d.idProducto) ===
                String(detalle.idProducto)
        );

        if (productoExistente) {
            const nuevaCantidad =
                Number(productoExistente.cantidad) +
                Number(detalle.cantidad);

            if (nuevaCantidad > detalle.stock) {
                alert(
                    `No puede superar el stock disponible (${detalle.stock}).`
                );
                return;
            }

            setFactura((prev) => ({
                ...prev,
                detalles: prev.detalles.map((d) =>
                    String(d.idProducto) ===
                    String(detalle.idProducto)
                        ? {
                              ...d,
                              cantidad: nuevaCantidad,
                              subtotal:
                                  nuevaCantidad *
                                  Number(d.precioUnitario)
                          }
                        : d
                )
            }));
        } else {
            const subtotalDetalle =
                Number(detalle.cantidad) *
                Number(detalle.precioUnitario);

            setFactura((prev) => ({
                ...prev,
                detalles: [
                    ...prev.detalles,
                    {
                        idProducto: Number(detalle.idProducto),
                        nombreProducto: detalle.nombreProducto,
                        cantidad: Number(detalle.cantidad),
                        precioUnitario: Number(
                            detalle.precioUnitario
                        ),
                        subtotal: subtotalDetalle
                    }
                ]
            }));
        }

        setDetalle({
            idProducto: "",
            nombreProducto: "",
            cantidad: 1,
            precioUnitario: 0,
            stock: 0
        });
    };

    const eliminarDetalle = (index) => {
        setFactura((prev) => ({
            ...prev,
            detalles: prev.detalles.filter(
                (_, i) => i !== index
            )
        }));
    };

    const subtotal = factura.detalles.reduce(
        (total, detalleActual) =>
            total +
            Number(detalleActual.subtotal || 0),
        0
    );

    const descuento = Math.max(
        0,
        Number(factura.descuento || 0)
    );

    const total = Math.max(
        0,
        subtotal - descuento
    );

    const guardar = async (e) => {
        e.preventDefault();

        if (!user?.idUsuario) {
            alert(
                "No se pudo identificar al usuario actual. Cierre sesión e ingrese nuevamente."
            );
            return;
        }

        if (!factura.idCliente) {
            alert("Debe seleccionar un cliente.");
            return;
        }

        if (factura.detalles.length === 0) {
            alert("Debe agregar al menos un producto.");
            return;
        }

        if (descuento > subtotal) {
            alert(
                "El descuento no puede superar el subtotal."
            );
            return;
        }

        setGuardando(true);

        try {
            const datosFactura = {
                idUsuario: Number(user.idUsuario),
                idCliente: Number(factura.idCliente),
                formaDePago: factura.formaDePago,
                descuento,
                observaciones: factura.observaciones,
                detalles: factura.detalles
            };

            const respuesta =
                await guardarFactura(datosFactura);

            if (respuesta?.success) {
                alert(
                    `Factura registrada correctamente.\n\nTotal: $${Number(
                        respuesta.data?.total ?? total
                    ).toLocaleString("es-CO")}`
                );

                setFactura({
                    idCliente: "",
                    formaDePago: "Efectivo",
                    descuento: 0,
                    observaciones: "",
                    detalles: []
                });

                setNombreCliente("");

                setDetalle({
                    idProducto: "",
                    nombreProducto: "",
                    cantidad: 1,
                    precioUnitario: 0,
                    stock: 0
                });

                if (recargar) {
                    recargar();
                }
            } else {
                alert(
                    respuesta?.message ||
                    respuesta?.mensaje ||
                    "No se pudo registrar la factura."
                );
            }
        } catch (error) {
            console.error(
                "Error al guardar factura:",
                error
            );

            const mensaje =
                error?.response?.data?.message ||
                error?.response?.data?.mensaje ||
                "Error al conectar con el servidor.";

            alert(mensaje);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="card shadow border-0 mb-4">
            <div className="card-header bg-primary text-white py-3 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">
                    <i className="bi bi-receipt-cutoff me-2"></i>
                    Nueva Factura
                </h5>

                {cancelar && (
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={cancelar}
                    ></button>
                )}
            </div>

            <div className="card-body p-4">
                <form onSubmit={guardar}>
                    {/* CLIENTE, FECHA Y PAGO */}
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">
                                Cliente{" "}
                                <span className="text-danger">
                                    *
                                </span>
                            </label>

                            <select
                                className="form-select"
                                value={factura.idCliente}
                                onChange={(e) =>
                                    seleccionarCliente(
                                        e.target.value
                                    )
                                }
                                required
                            >
                                <option value="">
                                    Seleccione un cliente
                                </option>

                                {clientes.map((cliente) => (
                                    <option
                                        key={cliente.idCliente}
                                        value={
                                            cliente.idCliente
                                        }
                                    >
                                        {cliente.nombre}{" "}
                                        {cliente.apellido}
                                        {" — "}
                                        {cliente.cedula}
                                    </option>
                                ))}
                            </select>

                            {nombreCliente && (
                                <small className="text-muted">
                                    Cliente seleccionado:{" "}
                                    {nombreCliente}
                                </small>
                            )}
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-semibold">
                                Fecha
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={hoyFecha}
                                readOnly
                                title="La fecha de la venta se registra automáticamente con la de hoy."
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label fw-semibold">
                                Forma de pago
                            </label>

                            <select
                                className="form-select"
                                value={
                                    factura.formaDePago
                                }
                                onChange={(e) =>
                                    setFactura(
                                        (prev) => ({
                                            ...prev,
                                            formaDePago:
                                                e.target.value
                                        })
                                    )
                                }
                            >
                                <option value="Efectivo">
                                    Efectivo
                                </option>

                                <option value="Tarjeta">
                                    Tarjeta
                                </option>

                                <option value="Transferencia">
                                    Transferencia
                                </option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-semibold">
                                Usuario
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={
                                    user
                                        ? `${user.nombre || ""} ${
                                              user.apellido || ""
                                          }`.trim()
                                        : "Sin usuario"
                                }
                                readOnly
                            />
                        </div>
                    </div>

                    <hr className="my-4" />

                    {/* PRODUCTOS */}
                    <div className="d-flex align-items-center mb-3">
                        <h5 className="fw-bold mb-0">
                            <i className="bi bi-cart-plus text-primary me-2"></i>
                            Productos
                        </h5>
                    </div>

                    <div className="row g-3 align-items-end">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Buscar producto (nombre o SKU)
                            </label>

                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ej. Martillo, CLA-001..."
                                    value={termino}
                                    onChange={(e) =>
                                        setTermino(
                                            e.target.value
                                        )
                                    }
                                />

                                <span className="input-group-text bg-white">
                                    <i
                                        className={`bi ${
                                            buscandoProductos
                                                ? "bi-arrow-repeat text-warning"
                                                : "bi-search text-muted"
                                        }`}
                                    ></i>
                                </span>
                            </div>

                            <small className="form-text text-muted">
                                {resultados.length > 0
                                    ? `${resultados.length} producto(s) encontrado(s).`
                                    : "Escriba para buscar en el catálogo."}
                            </small>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Resultados
                            </label>

                            <select
                                className="form-select"
                                value={detalle.idProducto || ""}
                                onChange={(e) =>
                                    seleccionarResultado(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Seleccione un producto...
                                </option>

                                {resultados.map((producto) => (
                                    <option
                                        key={producto.idProducto}
                                        value={producto.idProducto}
                                    >
                                        {producto.nombreProducto}{" "}
                                        ({producto.codigoSKU}) — $
                                        {Number(
                                            producto.precioUnitario ||
                                            0
                                        ).toLocaleString("es-CO")}{" "}
                                        · Stock{" "}
                                        {Number(producto.stock || 0)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {detalle.idProducto && (
                        <div className="row g-3 align-items-end mt-1">
                            <div className="col-md-4">
                                <div className="alert alert-light border mb-0 py-2">
                                    <div className="fw-semibold">
                                        {detalle.nombreProducto}
                                    </div>

                                    <small className="text-muted">
                                        Stock disponible:{" "}
                                        {detalle.stock}
                                    </small>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <label className="form-label fw-semibold">
                                    Cantidad
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    value={
                                        detalle.cantidad
                                    }
                                    onChange={(e) =>
                                        cambiarCantidad(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-semibold">
                                    Precio
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={
                                        detalle.precioUnitario
                                            ? `$${Number(
                                                  detalle.precioUnitario
                                              ).toLocaleString(
                                                  "es-CO"
                                              )}`
                                            : "$0"
                                    }
                                    readOnly
                                />
                            </div>

                            <div className="col-md-3">
                                <button
                                    type="button"
                                    className="btn btn-success w-100"
                                    onClick={
                                        agregarDetalle
                                    }
                                >
                                    <i className="bi bi-plus-lg me-1"></i>
                                    Agregar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TABLA */}
                    <div className="table-responsive mt-4">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Producto</th>
                                    <th className="text-center">
                                        Cantidad
                                    </th>
                                    <th className="text-end">
                                        Precio
                                    </th>
                                    <th className="text-end">
                                        Subtotal
                                    </th>
                                    <th className="text-center">
                                        Acción
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {factura.detalles.length ===
                                0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center text-muted py-4"
                                        >
                                            <i className="bi bi-cart-x fs-3 d-block mb-2"></i>
                                            No hay productos
                                            agregados.
                                        </td>
                                    </tr>
                                ) : (
                                    factura.detalles.map(
                                        (
                                            d,
                                            index
                                        ) => (
                                            <tr
                                                key={`${d.idProducto}-${index}`}
                                            >
                                                <td>
                                                    <span className="fw-semibold">
                                                        {
                                                            d.nombreProducto
                                                        }
                                                    </span>
                                                </td>

                                                <td className="text-center">
                                                    {
                                                        d.cantidad
                                                    }
                                                </td>

                                                <td className="text-end">
                                                    $
                                                    {Number(
                                                        d.precioUnitario
                                                    ).toLocaleString(
                                                        "es-CO"
                                                    )}
                                                </td>

                                                <td className="text-end fw-bold">
                                                    $
                                                    {Number(
                                                        d.subtotal
                                                    ).toLocaleString(
                                                        "es-CO"
                                                    )}
                                                </td>

                                                <td className="text-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            eliminarDetalle(
                                                                index
                                                            )
                                                        }
                                                        title="Eliminar producto"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    <hr />

                    {/* OBSERVACIONES Y TOTALES */}
                    <div className="row g-4">
                        <div className="col-md-7">
                            <label className="form-label fw-semibold">
                                Observaciones
                            </label>

                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Observaciones de la venta..."
                                value={
                                    factura.observaciones
                                }
                                onChange={(e) =>
                                    setFactura(
                                        (prev) => ({
                                            ...prev,
                                            observaciones:
                                                e.target.value
                                        })
                                    )
                                }
                            ></textarea>
                        </div>

                        <div className="col-md-5">
                            <div className="card bg-light border-0">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>
                                            Subtotal
                                        </span>

                                        <strong>
                                            $
                                            {subtotal.toLocaleString(
                                                "es-CO"
                                            )}
                                        </strong>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <label className="mb-0">
                                            Descuento
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control text-end"
                                            style={{
                                                maxWidth:
                                                    "150px"
                                            }}
                                            value={
                                                factura.descuento
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setFactura(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        descuento:
                                                            e
                                                                .target
                                                                .value
                                                    })
                                                )
                                            }
                                        />
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold fs-5">
                                            TOTAL
                                        </span>

                                        <span className="fw-bold fs-4 text-success">
                                            $
                                            {total.toLocaleString(
                                                "es-CO"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BOTONES */}
                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                        {cancelar && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={cancelar}
                                disabled={
                                    guardando
                                }
                            >
                                Cancelar
                            </button>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary fw-bold"
                            disabled={
                                guardando
                            }
                        >
                            {guardando ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-lg me-1"></i>
                                    Guardar Factura
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FacturaForm;