import { useEffect, useState } from "react";

import {
    obtenerResumenVentas
} from "../services/ventasService";

function Ventas() {

    const hoy =
        new Date()
            .toISOString()
            .split("T")[0];

    const primerDia =
        new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        )
            .toISOString()
            .split("T")[0];


    const [inicio, setInicio] =
        useState(primerDia);

    const [fin, setFin] =
        useState(hoy);

    const [datos, setDatos] =
        useState(null);

    const [cargando, setCargando] =
        useState(true);


    const cargar = async () => {

        try {

            setCargando(true);

            const res =
                await obtenerResumenVentas(
                    inicio,
                    fin
                );

            if (res.success) {
                setDatos(res.data);
            }

        } catch (error) {

            console.error(
                "Error cargando análisis:",
                error
            );

        } finally {

            setCargando(false);
        }
    };


    useEffect(() => {
        cargar();
    }, []);


    const aplicarFiltro = (e) => {

        e.preventDefault();

        cargar();
    };


    const dinero = (valor) =>
        `$${Number(
            valor || 0
        ).toLocaleString("es-CO")}`;


    if (cargando && !datos) {

        return (
            <div className="text-center py-5">

                <div
                    className="spinner-border text-warning"
                />

                <p className="text-muted mt-2">
                    Cargando análisis de ventas...
                </p>

            </div>
        );
    }


    const kpi =
        datos?.kpi || {};


    return (

        <div className="container-fluid">

            <div className="mb-4">

                <h2 className="fw-bold mb-1">
                    <i className="bi bi-graph-up-arrow text-warning me-2" />
                    Análisis de Ventas
                </h2>

                <p className="text-muted mb-0">
                    Consulte el comportamiento de las ventas
                    por período.
                </p>

            </div>


            {/* FILTROS */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <form
                        onSubmit={aplicarFiltro}
                        className="row g-3 align-items-end"
                    >

                        <div className="col-12 col-md-4">

                            <label className="form-label fw-semibold">
                                Desde
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={inicio}
                                onChange={e =>
                                    setInicio(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="col-12 col-md-4">

                            <label className="form-label fw-semibold">
                                Hasta
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={fin}
                                onChange={e =>
                                    setFin(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="col-12 col-md-4">

                            <button
                                className="btn btn-warning text-dark fw-bold w-100"
                                type="submit"
                            >
                                <i className="bi bi-funnel me-1" />
                                Aplicar período
                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* KPIs */}

            <div className="row g-3 mb-4">

                <div className="col-12 col-sm-6 col-xl-3">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="text-muted small">
                                VENTAS TOTALES
                            </div>

                            <div className="fs-3 fw-bold text-success">
                                {dinero(
                                    kpi.totalVentas
                                )}
                            </div>

                        </div>

                    </div>

                </div>


                <div className="col-12 col-sm-6 col-xl-3">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="text-muted small">
                                FACTURAS
                            </div>

                            <div className="fs-3 fw-bold">
                                {
                                    kpi.cantidadFacturas ||
                                    0
                                }
                            </div>

                        </div>

                    </div>

                </div>


                <div className="col-12 col-sm-6 col-xl-3">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="text-muted small">
                                TICKET PROMEDIO
                            </div>

                            <div className="fs-3 fw-bold">
                                {dinero(
                                    kpi.ticketPromedio
                                )}
                            </div>

                        </div>

                    </div>

                </div>


                <div className="col-12 col-sm-6 col-xl-3">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="text-muted small">
                                UNIDADES VENDIDAS
                            </div>

                            <div className="fs-3 fw-bold">
                                {
                                    kpi.unidadesVendidas ||
                                    0
                                }
                            </div>

                        </div>

                    </div>

                </div>

            </div>


            <div className="row g-4">

                {/* VENTAS POR DÍA */}

                <div className="col-12 col-xl-8">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-header bg-white">

                            <h5 className="fw-bold mb-0">
                                <i className="bi bi-bar-chart me-2 text-warning" />
                                Ventas por día
                            </h5>

                        </div>

                        <div className="card-body">

                            {datos?.ventasPorDia?.length === 0 ? (

                                <p className="text-muted text-center">
                                    No hay ventas en este período.
                                </p>

                            ) : (

                                datos?.ventasPorDia?.map(
                                    venta => (

                                        <div
                                            key={venta.fecha}
                                            className="mb-3"
                                        >

                                            <div className="d-flex justify-content-between mb-1">

                                                <span>
                                                    {venta.fecha}
                                                </span>

                                                <strong>
                                                    {dinero(
                                                        venta.total
                                                    )}
                                                </strong>

                                            </div>

                                            <div className="progress">
                                                <div
                                                    className="progress-bar bg-warning"
                                                    style={{
                                                        width:
                                                            `${Math.min(
                                                                100,
                                                                (
                                                                    Number(
                                                                        venta.total
                                                                    ) /
                                                                    Number(
                                                                        kpi.totalVentas ||
                                                                        1
                                                                    )
                                                                ) *
                                                                100 *
                                                                2
                                                            )}%`
                                                    }}
                                                />
                                            </div>

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    </div>

                </div>


                {/* FORMA DE PAGO */}

                <div className="col-12 col-xl-4">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-header bg-white">

                            <h5 className="fw-bold mb-0">
                                <i className="bi bi-credit-card me-2 text-warning" />
                                Formas de pago
                            </h5>

                        </div>

                        <div className="card-body">

                            {datos?.ventasPorPago?.map(
                                pago => (

                                    <div
                                        key={
                                            pago.formaDePago
                                        }
                                        className="d-flex justify-content-between border-bottom py-3"
                                    >

                                        <span>
                                            {
                                                pago.formaDePago
                                            }
                                        </span>

                                        <strong>
                                            {dinero(
                                                pago.total
                                            )}
                                        </strong>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>


                {/* PRODUCTOS MÁS VENDIDOS */}

                <div className="col-12">

                    <div className="card shadow-sm border-0">

                        <div className="card-header bg-white">

                            <h5 className="fw-bold mb-0">

                                <i className="bi bi-trophy me-2 text-warning" />

                                Productos más vendidos

                            </h5>

                        </div>


                        <div className="card-body p-0">

                            <div className="table-responsive">

                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-light">

                                        <tr>

                                            <th>
                                                #
                                            </th>

                                            <th>
                                                SKU
                                            </th>

                                            <th>
                                                Producto
                                            </th>

                                            <th className="text-center">
                                                Unidades
                                            </th>

                                            <th className="text-end">
                                                Ventas
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {datos?.productosMasVendidos?.map(
                                            (producto, index) => (

                                                <tr
                                                    key={
                                                        producto.idProducto
                                                    }
                                                >

                                                    <td>
                                                        <span className="badge bg-warning text-dark">
                                                            {index + 1}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <code>
                                                            {
                                                                producto.codigoSKU
                                                            }
                                                        </code>
                                                    </td>

                                                    <td className="fw-semibold">
                                                        {
                                                            producto.nombreProducto
                                                        }
                                                    </td>

                                                    <td className="text-center">
                                                        {
                                                            producto.unidades
                                                        }
                                                    </td>

                                                    <td className="text-end fw-bold text-success">
                                                        {dinero(
                                                            producto.total
                                                        )}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Ventas;