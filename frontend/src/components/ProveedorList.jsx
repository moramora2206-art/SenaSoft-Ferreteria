import { useEffect, useState } from "react";

import {
    listarProveedores,
    eliminarProveedor
} from "../services/proveedorService";

function ProveedorList({ editar, actualizar }) {

    const [proveedores, setProveedores] = useState([]);

    const cargarProveedores = async () => {

        try {

            const data = await listarProveedores();

            setProveedores(data);

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        cargarProveedores();

    }, [actualizar]);

    const eliminar = async (id) => {

        if (!window.confirm("¿Eliminar proveedor?"))
            return;

        await eliminarProveedor(id);

        cargarProveedores();

    };

    return (

        <div className="card shadow">

            <div className="card-header">
                Lista de Proveedores
            </div>

            <div className="card-body">

                <table className="table table-striped">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Proveedor</th>
                            <th>NIT</th>
                            <th>Contacto</th>
                            <th>Celular</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>

                    </thead>

                    <tbody>

                        {proveedores.map((p) => (

                            <tr key={p.idProveedor}>

                                <td>{p.idProveedor}</td>
                                <td>{p.nombreProveedor}</td>
                                <td>{p.nit}</td>
                                <td>{p.nombreContacto}</td>
                                <td>{p.nCelular}</td>
                                <td>{p.email}</td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => editar(p)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => eliminar(p.idProveedor)}
                                    >
                                        Eliminar
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default ProveedorList;