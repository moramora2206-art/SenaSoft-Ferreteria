import { useEffect, useState } from "react";

import {
    actualizarUsuario
} from "../services/usuarioService";

function UsuarioEdit({
    usuario,
    recargar
}) {

    const [datos, setDatos] = useState(usuario);

    useEffect(() => {

        setDatos(usuario);

    }, [usuario]);

    if (!usuario) return null;

    const handleChange = (e) => {

        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        await actualizarUsuario(datos);

        alert("Usuario actualizado");

        recargar();

    };

    return (

        <div className="card shadow mb-4">

            <div className="card-header">
                Editar Usuario
            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <label>Usuario</label>

                            <input
                                className="form-control"
                                name="usuario"
                                value={datos.usuario}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Contraseña</label>

                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={datos.password || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Nombre</label>

                            <input
                                className="form-control"
                                name="nombre"
                                value={datos.nombre}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Apellido</label>

                            <input
                                className="form-control"
                                name="apellido"
                                value={datos.apellido}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Email</label>

                            <input
                                className="form-control"
                                name="email"
                                value={datos.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Celular</label>

                            <input
                                className="form-control"
                                name="nCelular"
                                value={datos.nCelular}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Rol</label>

                            <select
                                className="form-select"
                                name="rol"
                                value={datos.rol}
                                onChange={handleChange}
                            >
                                <option value="Administrador">
                                    Administrador
                                </option>

                                <option value="Empleado">
                                    Empleado
                                </option>
                            </select>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Actualizar Usuario
                    </button>

                </form>

            </div>

        </div>

    );

}

export default UsuarioEdit;