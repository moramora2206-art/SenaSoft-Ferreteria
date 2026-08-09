import { useEffect, useState } from "react";

import {
    listarUsuarios,
    eliminarUsuario
} from "../services/usuarioService";

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

            </div>

        </div>

    );

}

export default UsuarioList;