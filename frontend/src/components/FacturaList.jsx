import { useEffect, useState } from "react";

import {
    listarFacturas,
<<<<<<< HEAD
    anularFactura
} from "../services/facturaService";

function FacturaList({
    editar,
    actualizar,
    onNuevo
=======
    eliminarFactura
}
from "../services/facturaService";

function FacturaList({
    editar,
    actualizar
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
}) {

    const [facturas, setFacturas] =
        useState([]);

<<<<<<< HEAD
    const [cargando, setCargando] =
        useState(true);


    const cargarFacturas = async () => {

        try {

            setCargando(true);

            const data =
                await listarFacturas();

            setFacturas(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Error al cargar facturas:",
                error
            );

            setFacturas([]);

        } finally {

            setCargando(false);
        }
    };


    useEffect(() => {
        cargarFacturas();
    }, [actualizar]);


    const anular = async (factura) => {

        if (
            factura.estado === "ANULADA"
        ) {
            return;
        }

        const confirmar =
            window.confirm(
                `¿Está seguro de anular la factura #${factura.idFactura}?\n\n` +
                "El stock de los productos será devuelto al inventario."
            );

        if (!confirmar) return;

        try {

            const res =
                await anularFactura(
                    factura.idFactura
                );

            if (res.success) {

                alert(
                    "Factura anulada correctamente. El stock fue devuelto."
                );

                cargarFacturas();

            } else {

                alert(
                    res.message ||
                    "No se pudo anular la factura."
                );
            }

        } catch (error) {

            console.error(error);

            alert(
                "Error al anular la factura."
            );
        }
    };


    return (
        <div className="card shadow-sm border-0">

            <div className="card-header bg-white py-3">

                <div className="row g-3 align-items-center">

                    <div className="col-12 col-md-6">

                        <h5 className="fw-bold mb-0">

                            <i className="bi bi-receipt text-warning me-2" />

                            Historial de Facturas (
                            {facturas.length}
                            )

                        </h5>

                    </div>


                    <div className="col-12 col-md-6">

                        <div className="d-flex justify-content-md-end">

                            <button
                                className="btn btn-warning text-dark fw-bold"
                                onClick={onNuevo}
                            >
                                <i className="bi bi-plus-lg me-1" />
                                Nueva Factura
                            </button>

                        </div>

                    </div>

                </div>

            </div>


            <div className="card-body p-0">

                {cargando ? (

                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-warning"
                            role="status"
                        />

                        <p className="mt-2 text-muted">
                            Cargando facturas...
                        </p>

                    </div>

                ) : facturas.length === 0 ? (

                    <div className="text-center py-5 text-muted">

                        <i className="bi bi-receipt fs-1 d-block mb-2" />

                        No hay facturas registradas.

                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th>Factura</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Pago</th>
                                    <th className="text-end">
                                        Total
                                    </th>
                                    <th className="text-center">
                                        Estado
                                    </th>
                                    <th className="text-center">
                                        Acciones
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {facturas.map(f => (

                                    <tr key={f.idFactura}>

                                        <td>
                                            <span className="fw-bold">
                                                #FAC-{f.idFactura}
                                            </span>
                                        </td>


                                        <td>
                                            {f.fechaVenta}
                                        </td>


                                        <td>
                                            <span className="fw-semibold">
                                                {f.nombreCliente ||
                                                    `Cliente #${f.idCliente}`}
                                            </span>
                                        </td>


                                        <td>
                                            <span className="badge bg-secondary-subtle text-secondary border">
                                                {f.formaDePago}
                                            </span>
                                        </td>


                                        <td className="text-end fw-bold">
                                            $
                                            {Number(
                                                f.total
                                            ).toLocaleString(
                                                "es-CO"
                                            )}
                                        </td>


                                        <td className="text-center">

                                            {f.estado ===
                                            "ANULADA" ? (

                                                <span className="badge bg-danger">
                                                    Anulada
                                                </span>

                                            ) : (

                                                <span className="badge bg-success">
                                                    Activa
                                                </span>

                                            )}

                                        </td>


                                        <td className="text-center">

                                            <div className="btn-group btn-group-sm">

                                                <button
                                                    className="btn btn-outline-primary"
                                                    title="Ver factura"
                                                    onClick={() =>
                                                        editar(f)
                                                    }
                                                >
                                                    <i className="bi bi-eye" />
                                                </button>


                                                {f.estado !==
                                                    "ANULADA" && (

                                                    <button
                                                        className="btn btn-outline-danger"
                                                        title="Anular factura"
                                                        onClick={() =>
                                                            anular(f)
                                                        }
                                                    >
                                                        <i className="bi bi-x-circle" />
                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}
=======
    const cargar = async () => {

        const datos =
            await listarFacturas();

        setFacturas(datos);

    };

    useEffect(() => {

        cargar();

    }, [actualizar]);

    return (

        <div className="card shadow">

            <div className="card-header">
                Facturas
            </div>

            <div className="card-body">

                <table className="table table-striped">

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Pago</th>
                            <th>Total</th>
                            <th>Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                        facturas.map(f => (

                            <tr key={f.idFactura}>

                                <td>{f.idFactura}</td>
                                <td>{f.nombreCliente}</td>
                                <td>{f.formaDePago}</td>
                                <td>{f.total}</td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => editar(f)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                        eliminarFactura(
                                        f.idFactura)}
                                    >
                                        Eliminar
                                    </button>

                                </td>

                            </tr>

                        ))

                        }

                    </tbody>

                </table>
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566

            </div>

        </div>
<<<<<<< HEAD
    );
=======

    );

>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
}

export default FacturaList;