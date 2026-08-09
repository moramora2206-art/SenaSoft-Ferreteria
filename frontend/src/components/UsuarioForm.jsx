import { useState } from "react";

import {
    guardarUsuario
} from "../services/usuarioService";

function UsuarioForm({ recargar }) {

    const [usuario, setUsuario] = useState({
        usuario: "",
        password: "",
        nombre: "",
        apellido: "",
        email: "",
        nCelular: "",
        rol: "Empleado"
    });

    const handleChange = (e) => {

        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        await guardarUsuario(usuario);

        alert("Usuario registrado");

        recargar();

    };

    return (

        <div className="card shadow mb-4">

            <div className="card-header">
                Registrar Usuario
            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <label>Usuario</label>
                            <input
                                className="form-control"
                                name="usuario"
                                value={usuario.usuario}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={usuario.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Nombre</label>
                            <input
                                className="form-control"
                                name="nombre"
                                value={usuario.nombre}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Apellido</label>
                            <input
                                className="form-control"
                                name="apellido"
                                value={usuario.apellido}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Email</label>
                            <input
                                className="form-control"
                                name="email"
                                value={usuario.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Celular</label>
                            <input
                                className="form-control"
                                name="nCelular"
                                value={usuario.nCelular}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Rol</label>

                            <select
                                className="form-select"
                                name="rol"
                                value={usuario.rol}
                                onChange={handleChange}
                            >
                                <option>Administrador</option>
                                <option>Empleado</option>
                            </select>

                        </div>

                    </div>

                    <button
                        className="btn btn-success"
                        type="submit"
                    >
                        Guardar Usuario
                    </button>

                </form>

            </div>

        </div>

    );

}

export default UsuarioForm;