import { useState } from "react";
<<<<<<< HEAD
import { guardarUsuario } from "../services/usuarioService";

function UsuarioForm({ recargar, cancelar }) {
=======

import {
    guardarUsuario
} from "../services/usuarioService";

function UsuarioForm({ recargar }) {
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566

    const [usuario, setUsuario] = useState({
        usuario: "",
        password: "",
        nombre: "",
        apellido: "",
        email: "",
        nCelular: "",
        rol: "Empleado"
    });

<<<<<<< HEAD
    const [guardando, setGuardando] = useState(false);

    const handleChange = (e) => {
=======
    const handleChange = (e) => {

>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
<<<<<<< HEAD
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setGuardando(true);

        try {

            const res = await guardarUsuario(usuario);

            if (res && res.success) {

                alert("Usuario registrado con éxito.");

                recargar();

            } else {

                alert(
                    res?.message ||
                    "Error al registrar el usuario."
                );

            }

        } catch (error) {

            console.error("Error al registrar usuario:", error);

            alert(
                "Error al conectar con el servidor."
            );

        } finally {

            setGuardando(false);

        }
    };

    return (
        <div className="card shadow border-0 mb-4">

            {/* ENCABEZADO */}
            <div className="card-header bg-warning text-dark py-3 d-flex align-items-center justify-content-between">

                <h5 className="fw-bold mb-0">

                    <i className="bi bi-person-plus me-2"></i>

                    Registrar Nuevo Usuario

                </h5>

                <button
                    type="button"
                    className="btn-close"
                    onClick={cancelar}
                    title="Cerrar"
                ></button>

            </div>

            {/* CONTENIDO */}
            <div className="card-body p-4">

                <form onSubmit={handleSubmit}>

                    <div className="row g-3">

                        {/* USUARIO */}
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Usuario{" "}
                                <span className="text-danger">*</span>
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="usuario"
                                placeholder="Ej. jperez"
                                value={usuario.usuario}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* CONTRASEÑA */}
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Contraseña{" "}
                                <span className="text-danger">*</span>
                            </label>

=======

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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
                            <input
                                type="password"
                                className="form-control"
                                name="password"
<<<<<<< HEAD
                                placeholder="Ingrese una contraseña"
                                value={usuario.password}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* NOMBRE */}
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Nombre{" "}
                                <span className="text-danger">*</span>
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                placeholder="Ej. Juan"
                                value={usuario.nombre}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* APELLIDO */}
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Apellido
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="apellido"
                                placeholder="Ej. Pérez"
                                value={usuario.apellido}
                                onChange={handleChange}
                            />

                        </div>

                        {/* EMAIL */}
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Correo Electrónico
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                placeholder="usuario@correo.com"
                                value={usuario.email}
                                onChange={handleChange}
                            />

                        </div>

                        {/* CELULAR */}
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Teléfono / Celular
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="nCelular"
                                placeholder="3112223344"
                                value={usuario.nCelular}
                                onChange={handleChange}
                            />

                        </div>

                        {/* ROL */}
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Rol{" "}
                                <span className="text-danger">*</span>
                            </label>
=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566

                            <select
                                className="form-select"
                                name="rol"
                                value={usuario.rol}
                                onChange={handleChange}
<<<<<<< HEAD
                                required
                            >

                                <option value="Administrador">
                                    Administrador
                                </option>

                                <option value="Empleado">
                                    Empleado
                                </option>

=======
                            >
                                <option>Administrador</option>
                                <option>Empleado</option>
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
                            </select>

                        </div>

                    </div>

<<<<<<< HEAD
                    {/* BOTONES */}
                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelar}
                            disabled={guardando}
                        >
                            <i className="bi bi-x-lg me-1"></i>
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn btn-warning text-dark fw-bold"
                            disabled={guardando}
                        >

                            {guardando ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                    ></span>

                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-person-plus me-1"></i>
                                    Guardar Usuario
                                </>
                            )}

                        </button>

                    </div>
=======
                    <button
                        className="btn btn-success"
                        type="submit"
                    >
                        Guardar Usuario
                    </button>
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566

                </form>

            </div>

        </div>
<<<<<<< HEAD
    );
=======

    );

>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
}

export default UsuarioForm;