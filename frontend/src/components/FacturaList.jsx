import { useEffect, useState } from "react";

import {
    listarFacturas,
    eliminarFactura
}
from "../services/facturaService";

function FacturaList({
    editar,
    actualizar
}) {

    const [facturas, setFacturas] =
        useState([]);

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

            </div>

        </div>

    );

}

export default FacturaList;