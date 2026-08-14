import { useEffect, useState } from "react";
<<<<<<< HEAD
import { guardarFactura } from "../services/facturaService";
import { listarClientes } from "../services/clienteService";
import { buscarProducto } from "../services/productoService";
import { useAuth } from "../context/AuthContext";

function FacturaForm({ recargar, cancelar }) {

    const { user } = useAuth();

    const [clientes, setClientes] = useState([]);

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

    const [nombreCliente, setNombreCliente] = useState("");
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async () => {
        try {
            const data = await listarClientes();

            if (Array.isArray(data)) {
                setClientes(data);
            } else if (data?.success && Array.isArray(data.data)) {
                setClientes(data.data);
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

    const cargarProducto = async (id) => {
        if (!id) return;

        try {
            const respuesta = await buscarProducto(id);

            const producto =
                respuesta?.data ||
                respuesta;

            if (!producto) {
                alert("Producto no encontrado.");
                return;
            }

            setDetalle((prev) => ({
                ...prev,
                idProducto: id,
                nombreProducto:
                    producto.nombreProducto ||
                    producto.nombre ||
                    producto.Nombre_Producto ||
                    "",
                precioUnitario: Number(
                    producto.precioUnitario ||
                    producto.precio ||
                    producto.Precio_Unitario ||
                    0
                ),
                stock: Number(
                    producto.stock ||
                    producto.Stock ||
                    0
                )
            }));

        } catch (error) {
            console.error("Error buscando producto:", error);

            if (error?.response?.status === 404) {
                alert(`No existe un producto con ID ${id}.`);
            } else {
                alert("No se pudo consultar el producto.");
            }
        }
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

        if (detalle.cantidad <= 0) {
            alert("La cantidad debe ser mayor que cero.");
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
                String(d.idProducto) === String(detalle.idProducto)
        );

        if (productoExistente) {

            const nuevaCantidad =
                productoExistente.cantidad +
                detalle.cantidad;

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
                                d.precioUnitario
                        }
                        : d
                )
            }));

        } else {

            const subtotal =
                detalle.cantidad *
                detalle.precioUnitario;

            setFactura((prev) => ({
                ...prev,
                detalles: [
                    ...prev.detalles,
                    {
                        idProducto: Number(detalle.idProducto),
                        nombreProducto: detalle.nombreProducto,
                        cantidad: detalle.cantidad,
                        precioUnitario: detalle.precioUnitario,
                        subtotal
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
            total + Number(detalleActual.subtotal || 0),
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

=======

import { guardarFactura }
from "../services/facturaService";

import { listarClientes }
from "../services/clienteService";

import { buscarProducto }
from "../services/productoService";

function FacturaForm({ recargar }) {

    const [factura, setFactura] = useState({

        idCliente: "",
        idUsuario: "",

        formaDePago: "Efectivo",

        descuento: 0,

        observaciones: "",

        detalles: []

    });

    const [clientes, setClientes] = useState([]);

    const [nombreCliente, setNombreCliente] = useState("");

    useEffect(() => {

        cargarClientes();

    }, []);

    const cargarClientes = async () => {

        const data =
            await listarClientes();

        setClientes(data);

    };

    const buscarCliente = (id) => {

        const cliente =
            clientes.find(
                c => c.idCliente == id
            );

        if (cliente) {

            setNombreCliente(
                cliente.nombre +
                " " +
                cliente.apellido
            );

        } else {

            setNombreCliente("");

        }

    };

    const cargarProducto = async (id) => {

        if (!id) return;

        try {

            const producto =
                await buscarProducto(id);

            setDetalle({

                ...detalle,

                idProducto: id,

                nombreProducto:
                    producto.nombre,

                precioUnitario:
                    producto.precio

            });

        } catch (error) {

            console.log(error);

        }

    };

    const [detalle, setDetalle] = useState({

        idProducto: "",

        nombreProducto: "",

        cantidad: 1,

        precioUnitario: 0

    });

    const agregarDetalle = () => {

        const subtotal =

            detalle.cantidad *

            detalle.precioUnitario;

        setFactura({

            ...factura,

            detalles: [

                ...factura.detalles,

                {
                    ...detalle,
                    subtotal
                }

            ]

        });

    };

    const calcularTotal = () => {

        const subtotal =

            factura.detalles.reduce(

                (acc, d) =>

                    acc + d.subtotal,

                0

            );

        return subtotal -

            Number(factura.descuento);

    };

>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    const guardar = async (e) => {

        e.preventDefault();

<<<<<<< HEAD
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
            alert("El descuento no puede superar el subtotal.");
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
                        respuesta.data?.total || total
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

                recargar();

            } else {

                alert(
                    respuesta?.message ||
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

                    {/* CLIENTE Y PAGO */}

                    <div className="row g-3">

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Cliente <span className="text-danger">*</span>
                            </label>

                            <select
                                className="form-select"
                                value={factura.idCliente}
                                onChange={(e) =>
                                    seleccionarCliente(e.target.value)
                                }
                                required
                            >

                                <option value="">
                                    Seleccione un cliente
                                </option>

                                {clientes.map((cliente) => (

                                    <option
                                        key={cliente.idCliente}
                                        value={cliente.idCliente}
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
                                    Cliente seleccionado: {nombreCliente}
                                </small>
                            )}

                        </div>

                        <div className="col-md-3">

                            <label className="form-label fw-semibold">
                                Forma de pago
                            </label>

                            <select
                                className="form-select"
                                value={factura.formaDePago}
                                onChange={(e) =>
                                    setFactura((prev) => ({
                                        ...prev,
                                        formaDePago:
                                            e.target.value
                                    }))
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
                                        ? `${user.nombre || ""} ${user.apellido || ""}`.trim()
                                        : "Sin usuario"
                                }
=======
        await guardarFactura({

            ...factura,

            total:
                calcularTotal()

        });

        alert("Factura guardada");

        recargar();

    };

    return (

        <div className="card shadow mb-4">

            <div className="card-header">
                Nueva Factura
            </div>

            <div className="card-body">

                <form onSubmit={guardar}>

                    <div className="row">

                        <div className="col-md-3">

                            <input
                                className="form-control"
                                placeholder="ID Cliente"

                                onChange={(e) => {

                                    const id =
                                        e.target.value;

                                    setFactura({

                                        ...factura,

                                        idCliente: id

                                    });

                                    buscarCliente(id);

                                }}
                            />

                            <input
                                className="form-control mt-2"
                                value={nombreCliente}
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
                                readOnly
                            />

                        </div>

<<<<<<< HEAD
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

                        <div className="col-md-2">

                            <label className="form-label fw-semibold">
                                ID Producto
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                className="form-control"
                                placeholder="Ej. 12"
                                value={detalle.idProducto}
                                onChange={(e) => {
                                    const valor = e.target.value.replace(/\D/g, "");

                                    setDetalle((prev) => ({
                                        ...prev,
                                        idProducto: valor
                                    }));
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        cargarProducto(detalle.idProducto);
                                    }
                                }}
                                onBlur={() => {
                                    if (detalle.idProducto) {
                                        cargarProducto(detalle.idProducto);
                                    }
                                }}
=======
                        <div className="col-md-3">

                            <input
                                className="form-control"
                                placeholder="ID Usuario"
                                onChange={(e)=>

                                setFactura({
                                    ...factura,
                                    idUsuario:e.target.value
                                })

                                }
                            />

                        </div>

                        <div className="col-md-3">

                            <select
                                className="form-select"

                                onChange={(e)=>

                                setFactura({
                                    ...factura,
                                    formaDePago:e.target.value
                                })

                                }
                            >

                                <option>Efectivo</option>
                                <option>Tarjeta</option>
                                <option>Transferencia</option>

                            </select>

                        </div>

                    </div>

                    <hr />

                    <h5>
                        Productos
                    </h5>

                    <div className="row">

                        <div className="col-md-2">

                            <input
                                className="form-control"
                                placeholder="ID"

                                onChange={(e) =>

                                    cargarProducto(
                                        e.target.value
                                    )

                                }
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
                            />

                        </div>

                        <div className="col-md-4">

<<<<<<< HEAD
                            <label className="form-label fw-semibold">
                                Producto
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={detalle.nombreProducto}
                                readOnly
=======
                            <input
                                className="form-control"
                                value={detalle.nombreProducto}
                                readOnly
                                onChange={(e)=>

                                setDetalle({
                                    ...detalle,
                                    nombreProducto:e.target.value
                                })

                                }
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
                            />

                        </div>

                        <div className="col-md-2">

<<<<<<< HEAD
                            <label className="form-label fw-semibold">
                                Cantidad
                            </label>

                            <input
                                type="number"
                                min="1"
                                className="form-control"
                                value={detalle.cantidad}
                                onChange={(e) =>
                                    cambiarCantidad(e.target.value)
=======
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Cantidad"
                                onChange={(e)=>

                                setDetalle({
                                    ...detalle,
                                    cantidad:Number(e.target.value)
                                })

>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
                                }
                            />

                        </div>

                        <div className="col-md-2">

<<<<<<< HEAD
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
                                        ).toLocaleString("es-CO")}`
                                        : "$0"
                                }
                                readOnly
=======
                            <input
                                type="number"
                                className="form-control"
                                value={detalle.precioUnitario}
                                readOnly
                                onChange={(e)=>

                                setDetalle({
                                    ...detalle,
                                    precioUnitario:Number(e.target.value)
                                })

                                }
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
                            />

                        </div>

                        <div className="col-md-2">

                            <button
                                type="button"
<<<<<<< HEAD
                                className="btn btn-success w-100"
                                onClick={agregarDetalle}
                            >
                                <i className="bi bi-plus-lg me-1"></i>
=======
                                className="btn btn-success"
                                onClick={agregarDetalle}
                            >
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
                                Agregar
                            </button>

                        </div>

                    </div>

<<<<<<< HEAD
                    {detalle.idProducto && (
                        <div className="mt-2">

                            <span className="badge bg-secondary">
                                Stock disponible: {detalle.stock}
                            </span>

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

                                {factura.detalles.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center text-muted py-4"
                                        >
                                            <i className="bi bi-cart-x fs-3 d-block mb-2"></i>
                                            No hay productos agregados.
                                        </td>

                                    </tr>

                                ) : (

                                    factura.detalles.map(
                                        (d, index) => (

                                            <tr key={`${d.idProducto}-${index}`}>

                                                <td>
                                                    <span className="fw-semibold">
                                                        {d.nombreProducto}
                                                    </span>
                                                </td>

                                                <td className="text-center">
                                                    {d.cantidad}
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
                                value={factura.observaciones}
                                onChange={(e) =>
                                    setFactura((prev) => ({
                                        ...prev,
                                        observaciones:
                                            e.target.value
                                    }))
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
                                                maxWidth: "150px"
                                            }}
                                            value={
                                                factura.descuento
                                            }
                                            onChange={(e) =>
                                                setFactura(
                                                    (prev) => ({
                                                        ...prev,
                                                        descuento:
                                                            e.target.value
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
=======
                    <table className="table mt-4">

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Subtotal</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                            factura.detalles.map(

                                (d,index)=>(

                                <tr key={index}>

                                    <td>{d.idProducto}</td>
                                    <td>{d.nombreProducto}</td>
                                    <td>{d.cantidad}</td>
                                    <td>{d.precioUnitario}</td>
                                    <td>{d.subtotal}</td>

                                </tr>

                            ))

                            }

                        </tbody>

                    </table>

                    <div className="row">

                        <div className="col-md-3">

                            <input
                                type="number"
                                className="form-control"
                                placeholder="Descuento"

                                onChange={(e)=>

                                setFactura({
                                    ...factura,
                                    descuento:e.target.value
                                })

                                }
                            />

                        </div>

                        <div className="col-md-3">

                            <input
                                className="form-control"
                                readOnly
                                value={calcularTotal()}
                            />
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566

                        </div>

                    </div>

<<<<<<< HEAD
                    {/* BOTONES */}

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">

                        {cancelar && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={cancelar}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary fw-bold"
                            disabled={guardando}
                        >

                            {guardando ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                    ></span>
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
=======
                    <button
                        className="btn btn-primary mt-3"
                        type="submit"
                    >
                        Guardar Factura
                    </button>
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566

                </form>

            </div>

        </div>
<<<<<<< HEAD
    );
=======

    );

>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
}

export default FacturaForm;