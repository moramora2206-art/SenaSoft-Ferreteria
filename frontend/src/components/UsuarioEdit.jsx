import { useEffect, useState } from "react";

import {
    actualizarUsuario
} from "../services/usuarioService";

function UsuarioEdit({
    usuario,
    recargar,
    cancelar
}) {

    const [datos, setDatos] = useState({
        usuario: "",
        password: "",
        nombre: "",
        apellido: "",
        email: "",
        nCelular: "",
        rol: "Empleado"
    });

    const [guardando, setGuardando] = useState(false);

    useEffect(() => {

        if (usuario) {

            setDatos({
                idUsuario: usuario.idUsuario,

                usuario: usuario.usuario || "",

                // No mostrar la contraseña almacenada
                password: "",

                nombre: usuario.nombre || "",

                apellido: usuario.apellido || "",

                email: usuario.email || "",

                nCelular: usuario.nCelular || "",

                rol: usuario.rol || "Empleado"
            });

        }

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

        setGuardando(true);

        try {

            // Copiamos los datos para no modificar el estado
            const datosEnviar = {
                ...datos
            };

            /*
             * Si la contraseña está vacía,
             * no se envía para que el backend
             * conserve la contraseña actual.
             */
            if (!datosEnviar.password) {
                delete datosEnviar.password;
            }

            const res = await actualizarUsuario(datosEnviar);

            if (res && res.success) {

                alert("Usuario actualizado correctamente.");

                recargar();

            } else {

                alert(
                    res?.message ||
                    "Error al actualizar el usuario."
                );

            }

        } catch (error) {

            console.error(
                "Error al actualizar usuario:",
                error
            );

            alert(
                "Error al intentar actualizar el usuario."
            );

        } finally {

            setGuardando(false);

        }
    };

    return (
        <div className="card shadow border-0 mb-4">

            {/* ENCABEZADO */}
            <div className="card-header bg-primary text-white py-3 d-flex align-items-center justify-content-between">

                <h5 className="fw-bold mb-0">

                    <i className="bi bi-pencil-square me-2"></i>

                    Editar Usuario #{datos.idUsuario}

                </h5>

                <button
                    type="button"
                    className="btn-close btn-close-white"
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
                                value={datos.usuario}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* CONTRASEÑA */}
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Nueva Contraseña
                            </label>

                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={datos.password}
                                onChange={handleChange}
                                placeholder="Dejar vacío para conservar la actual"
                            />

                            <div className="form-text">
                                Solo complete este campo si desea cambiar la contraseña.
                            </div>

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
                                value={datos.nombre}
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
                                value={datos.apellido}
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
                                value={datos.email}
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
                                value={datos.nCelular}
                                onChange={handleChange}
                            />

                        </div>

                        {/* ROL */}
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Rol{" "}
                                <span className="text-danger">*</span>
                            </label>

                            <select
                                className="form-select"
                                name="rol"
                                value={datos.rol}
                                onChange={handleChange}
                                required
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
                            className="btn btn-primary fw-bold"
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
                                    <i className="bi bi-check-lg me-1"></i>
                                    Actualizar Usuario
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default UsuarioEdit;