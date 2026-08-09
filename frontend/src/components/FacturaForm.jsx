import { useEffect, useState } from "react";

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

    const guardar = async (e) => {

        e.preventDefault();

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
                                readOnly
                            />

                        </div>

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
                            />

                        </div>

                        <div className="col-md-4">

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
                            />

                        </div>

                        <div className="col-md-2">

                            <input
                                type="number"
                                className="form-control"
                                placeholder="Cantidad"
                                onChange={(e)=>

                                setDetalle({
                                    ...detalle,
                                    cantidad:Number(e.target.value)
                                })

                                }
                            />

                        </div>

                        <div className="col-md-2">

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
                            />

                        </div>

                        <div className="col-md-2">

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={agregarDetalle}
                            >
                                Agregar
                            </button>

                        </div>

                    </div>

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

                        </div>

                    </div>

                    <button
                        className="btn btn-primary mt-3"
                        type="submit"
                    >
                        Guardar Factura
                    </button>

                </form>

            </div>

        </div>

    );

}

export default FacturaForm;