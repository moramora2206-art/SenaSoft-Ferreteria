import { useEffect, useState } from "react";

import {
    listarProveedores,
    eliminarProveedor
} from "../services/proveedorService";

<<<<<<< HEAD
function ProveedorList({ editar, actualizar, onNuevo }) {

    const [proveedores, setProveedores] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    const cargarProveedores = async () => {
        try {
            setCargando(true);

            const res = await listarProveedores();

            if (res && res.success) {
                setProveedores(res.data || []);
            } else {
                console.error(
                    "Error al listar proveedores",
                    res && res.message
                );

                setProveedores([]);
            }

        } catch (error) {
            console.error("Error al obtener proveedores", error);
            setProveedores([]);

=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarProveedores();
    }, [actualizar]);

<<<<<<< HEAD
    const handleSearchSubmit = (e) => {
        e.preventDefault();

        if (!busqueda.trim()) {
            cargarProveedores();
            return;
        }

        const texto = busqueda.toLowerCase();

        const filtrados = proveedores.filter((p) =>
            String(p.nombreProveedor || "")
                .toLowerCase()
                .includes(texto) ||

            String(p.nit || "")
                .toLowerCase()
                .includes(texto) ||

            String(p.nombreContacto || "")
                .toLowerCase()
                .includes(texto) ||

            String(p.email || "")
                .toLowerCase()
                .includes(texto)
        );

        setProveedores(filtrados);
    };

    const eliminar = async (id, nombre) => {

        if (
            !window.confirm(
                `¿Está seguro de eliminar al proveedor "${nombre}"?`
            )
        ) {
            return;
        }

        try {

            const res = await eliminarProveedor(id);

            if (res && res.success) {

                alert("Proveedor eliminado correctamente.");

                cargarProveedores();

            } else {

                alert(
                    res && res.message
                        ? res.message
                        : "No se pudo eliminar el proveedor."
                );
            }

        } catch (err) {

            console.error("Error al eliminar proveedor", err);

            alert(
                "Error al eliminar el proveedor. Compruebe la conexión al servidor."
            );
=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        }
    };

    return (
<<<<<<< HEAD
        <div className="card shadow-sm border-0">

            {/* CABECERA */}
            <div className="card-header bg-white py-3">

                <div className="row g-3 align-items-center">

                    <div className="col-12 col-md-5">

                        <h5 className="fw-bold mb-0 text-dark">

                            <i className="bi bi-truck text-warning me-2"></i>

                            Directorio de Proveedores (
                            {proveedores.length}
                            )

                        </h5>

                    </div>

                    <div className="col-12 col-md-7">

                        <div className="d-flex flex-wrap gap-2 justify-content-md-end">

                            {/* BUSCADOR */}
                            <form
                                onSubmit={handleSearchSubmit}
                                className="d-flex gap-2 flex-grow-1"
                                style={{ maxWidth: "350px" }}
                            >

                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Buscar proveedor, NIT..."
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(e.target.value)
                                    }
                                />

                                <button
                                    type="submit"
                                    className="btn btn-sm btn-outline-secondary"
                                >
                                    <i className="bi bi-search"></i>
                                </button>

                            </form>

                            {/* NUEVO */}
                            <button
                                className="btn btn-sm btn-warning text-dark fw-bold"
                                onClick={onNuevo}
                            >
                                <i className="bi bi-person-plus me-1"></i>
                                Nuevo Proveedor
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* CONTENIDO */}
            <div className="card-body p-0">

                {cargando ? (

                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-warning"
                            role="status"
                        ></div>

                        <p className="mt-2 text-muted">
                            Cargando proveedores...
                        </p>

                    </div>

                ) : proveedores.length === 0 ? (

                    <div className="text-center py-5 text-muted">

                        <i className="bi bi-truck fs-1 d-block mb-2"></i>

                        No se encontraron proveedores registrados.

                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th>ID</th>

                                    <th>Proveedor</th>

                                    <th>NIT</th>

                                    <th>Contacto</th>

                                    <th>Celular</th>

                                    <th>Correo Electrónico</th>

                                    <th className="text-center">
                                        Acciones
                                    </th>

=======

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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
                                </tr>

                            </thead>

                            <tbody>

<<<<<<< HEAD
                                {proveedores.map((p) => (

                                    <tr key={p.idProveedor}>

                                        <td>
                                            <span className="fw-bold text-muted">
                                                #{p.idProveedor}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="fw-semibold">
                                                {p.nombreProveedor}
                                            </div>
                                        </td>

                                        <td>
                                            <code>
                                                {p.nit || "-"}
                                            </code>
                                        </td>

                                        <td>
                                            {p.nombreContacto || "-"}
                                        </td>

                                        <td>
                                            {p.nCelular || "-"}
                                        </td>

                                        <td>
                                            <small className="text-muted">
                                                {p.email || "-"}
                                            </small>
                                        </td>

                                        <td className="text-center">

                                            <div className="btn-group btn-group-sm">

                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() =>
                                                        editar(p)
                                                    }
                                                    title="Editar proveedor"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>

                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() =>
                                                        eliminar(
                                                            p.idProveedor,
                                                            p.nombreProveedor
                                                        )
                                                    }
                                                    title="Eliminar proveedor"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}
=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566

                            </tbody>

                        </table>
<<<<<<< HEAD

                    </div>

=======
                    </div>
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
                )}

            </div>

        </div>
<<<<<<< HEAD
    );
}

export default ProveedorList;
=======

    );

}

export default ProveedorList;
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
