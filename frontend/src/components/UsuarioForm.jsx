import { useState } from "react";
import { guardarUsuario } from "../services/usuarioService";

function UsuarioForm({ recargar, cancelar }) {

    const [usuario, setUsuario] = useState({
        usuario: "",
        password: "",
        nombre: "",
        apellido: "",
        email: "",
        nCelular: "",
        rol: "Empleado"
    });

    const [guardando, setGuardando] = useState(false);

    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
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

                            <input
                                type="password"
                                className="form-control"
                                name="password"
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

                            <select
                                className="form-select"
                                name="rol"
                                value={usuario.rol}
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

                </form>

            </div>

        </div>
    );
}

export default UsuarioForm;