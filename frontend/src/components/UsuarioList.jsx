import { useEffect, useState } from "react";

import {
    listarUsuarios,
    eliminarUsuario
} from "../services/usuarioService";

<<<<<<< HEAD
function UsuarioList({ editar, actualizar, onNuevo }) {

    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    const cargarUsuarios = async () => {
        try {
            setCargando(true);

            const respuesta = await listarUsuarios();

            /*
             * El backend actualmente devuelve:
             *
             * {
             *   success: true,
             *   data: [...]
             * }
             *
             * Pero dejamos compatibilidad por si el servicio
             * ya devuelve directamente el array.
             */

            if (respuesta && respuesta.success) {
                setUsuarios(
                    Array.isArray(respuesta.data)
                        ? respuesta.data
                        : []
                );
            } else if (Array.isArray(respuesta)) {
                setUsuarios(respuesta);
            } else {
                setUsuarios([]);
            }

        } catch (error) {

            console.error("Error al cargar usuarios:", error);

            setUsuarios([]);

        } finally {

            setCargando(false);

        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, [actualizar]);

    const eliminar = async (id, nombre) => {

        if (
            !window.confirm(
                `¿Está seguro de eliminar al usuario "${nombre}"?`
            )
        ) {
            return;
        }

        try {

            const respuesta = await eliminarUsuario(id);

            if (respuesta && respuesta.success) {

                alert("Usuario eliminado correctamente.");

                cargarUsuarios();

            } else {

                alert(
                    respuesta?.message ||
                    "No se pudo eliminar el usuario."
                );

            }

        } catch (error) {

            console.error("Error al eliminar usuario:", error);

            alert(
                "Error al eliminar el usuario. Compruebe la conexión con el servidor."
            );
        }
    };

    const usuariosFiltrados = usuarios.filter((u) => {

        const texto = busqueda.toLowerCase().trim();

        if (!texto) return true;

        return (
            String(u.usuario || "")
                .toLowerCase()
                .includes(texto) ||

            String(u.nombre || "")
                .toLowerCase()
                .includes(texto) ||

            String(u.apellido || "")
                .toLowerCase()
                .includes(texto) ||

            String(u.email || "")
                .toLowerCase()
                .includes(texto) ||

            String(u.rol || "")
                .toLowerCase()
                .includes(texto)
        );
    });

    return (
        <div className="card shadow-sm border-0">

            {/* CABECERA */}
            <div className="card-header bg-white py-3">

                <div className="row g-3 align-items-center">

                    <div className="col-12 col-md-5">

                        <h5 className="fw-bold mb-0 text-dark">

                            <i className="bi bi-people text-warning me-2"></i>

                            Directorio de Usuarios (
                            {usuariosFiltrados.length}
                            )

                        </h5>

                    </div>

                    <div className="col-12 col-md-7">

                        <div className="d-flex flex-wrap gap-2 justify-content-md-end">

                            {/* BUSCADOR */}
                            <div
                                className="input-group input-group-sm flex-grow-1"
                                style={{ maxWidth: "350px" }}
                            >

                                <span className="input-group-text bg-light">
                                    <i className="bi bi-search"></i>
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar usuario, nombre, rol..."
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(e.target.value)
                                    }
                                />

                            </div>

                            {/* NUEVO USUARIO */}
                            <button
                                className="btn btn-sm btn-warning text-dark fw-bold"
                                onClick={onNuevo}
                            >
                                <i className="bi bi-person-plus me-1"></i>
                                Nuevo Usuario
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
                            Cargando usuarios...
                        </p>

                    </div>

                ) : usuariosFiltrados.length === 0 ? (

                    <div className="text-center py-5 text-muted">

                        <i className="bi bi-person-slash fs-1 d-block mb-2"></i>

                        {busqueda
                            ? "No se encontraron usuarios con esa búsqueda."
                            : "No se encontraron usuarios registrados."
                        }

                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Correo Electrónico</th>
                                    <th>Celular</th>
                                    <th>Rol</th>
                                    <th className="text-center">
                                        Acciones
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {usuariosFiltrados.map((u) => (

                                    <tr key={u.idUsuario}>

                                        <td>
                                            <span className="fw-bold text-muted">
                                                #{u.idUsuario}
                                            </span>
                                        </td>

                                        <td>
                                            <code className="fw-bold">
                                                {u.usuario}
                                            </code>
                                        </td>

                                        <td className="fw-semibold">
                                            {u.nombre || "-"}
                                        </td>

                                        <td>
                                            {u.apellido || "-"}
                                        </td>

                                        <td>
                                            <small className="text-muted">
                                                {u.email || "-"}
                                            </small>
                                        </td>

                                        <td>
                                            {u.nCelular || "-"}
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    u.rol === "Administrador"
                                                        ? "badge bg-warning text-dark"
                                                        : "badge bg-secondary-subtle text-secondary border"
                                                }
                                            >
                                                {u.rol || "Sin rol"}
                                            </span>

                                        </td>

                                        <td className="text-center">

                                            <div className="btn-group btn-group-sm">

                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => editar(u)}
                                                    title="Editar usuario"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>

                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() =>
                                                        eliminar(
                                                            u.idUsuario,
                                                            u.usuario
                                                        )
                                                    }
                                                    title="Eliminar usuario"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}
=======
function UsuarioList({ editar, actualizar }) {

    const [usuarios, setUsuarios] = useState([]);

    const cargarUsuarios = async () => {

        try {

            const data = await listarUsuarios();

            setUsuarios(data);

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        cargarUsuarios();

    }, [actualizar]);

    const eliminar = async (id) => {

        if (!window.confirm("¿Eliminar usuario?"))
            return;

        await eliminarUsuario(id);

        cargarUsuarios();

    };

    return (

        <div className="card shadow">

            <div className="card-header">
                Lista de Usuarios
            </div>

            <div className="card-body">

                <table className="table table-striped">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Celular</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>

                    </thead>

                    <tbody>

                        {usuarios.map((u) => (

                            <tr key={u.idUsuario}>

                                <td>{u.idUsuario}</td>
                                <td>{u.usuario}</td>
                                <td>{u.nombre}</td>
                                <td>{u.apellido}</td>
                                <td>{u.email}</td>
                                <td>{u.nCelular}</td>
                                <td>{u.rol}</td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => editar(u)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => eliminar(u.idUsuario)}
                                    >
                                        Eliminar
                                    </button>

                                </td>

                            </tr>

                        ))}

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

export default UsuarioList;