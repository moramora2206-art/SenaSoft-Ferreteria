import { useEffect, useState } from "react";

import {
    listarProveedores,
    eliminarProveedor
} from "../services/proveedorService";

function ProveedorList({ editar, actualizar }) {

    const [proveedores, setProveedores] = useState([]);
    const [cargando, setCargando] = useState(true);

    const cargarProveedores = async () => {
        setCargando(true);
        try {
            const res = await listarProveedores();
            if (res && res.success) {
                setProveedores(res.data || []);
            } else {
                console.error("Error al listar proveedores", res && res.message);
                setProveedores([]);
            }
        } catch (error) {
            console.error("Error al obtener proveedores", error);
            setProveedores([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarProveedores();
    }, [actualizar]);

    const eliminar = async (id) => {
        if (!window.confirm("¿Eliminar proveedor?")) return;

        try {
            const res = await eliminarProveedor(id);
            if (res && res.success) {
                alert("Proveedor eliminado correctamente.");
                cargarProveedores();
            } else {
                alert(res && res.message ? res.message : "No se pudo eliminar el proveedor.");
            }
        } catch (err) {
            console.error("Error al eliminar proveedor", err);
            alert("Error al eliminar el proveedor. Compruebe la conexión al servidor.");
        }
    };

    return (

        <div className="card shadow">

            <div className="card-header">
                Lista de Proveedores
            </div>

            <div className="card-body">
                {cargando ? (
                    <div className="text-center py-3">
                        <div className="spinner-border text-warning" role="status"></div>
                    </div>
                ) : (
                    <div className="table-responsive">
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

                                {proveedores.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center text-muted">No se encontraron proveedores.</td>
                                    </tr>
                                ) : (
                                    proveedores.map((p) => (

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

                                    ))
                                )}

                            </tbody>

                        </table>
                    </div>
                )}

            </div>

        </div>

    );

}

export default ProveedorList;
