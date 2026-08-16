import { useState } from "react";
import { guardarUsuario } from "../services/usuarioService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES_VALIDOS = ["Administrador", "Empleado"];

function validar(datos) {
    const errores = {};

    if (!datos.usuario) {
        errores.usuario = "El nombre de usuario es obligatorio.";
    }

    if (!datos.password) {
        errores.password = "La contraseña es obligatoria.";
    } else if (datos.password.length < 6) {
        errores.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (!datos.nombre) {
        errores.nombre = "El nombre es obligatorio.";
    }

    if (datos.email && !EMAIL_REGEX.test(datos.email)) {
        errores.email = "Ingresa un correo electrónico válido.";
    }

    if (!ROLES_VALIDOS.includes(datos.rol)) {
        errores.rol = "Selecciona un rol válido.";
    }

    return errores;
}

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
    const [errores, setErrores] = useState({});
    const [mensajeGeneral, setMensajeGeneral] = useState("");

    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });

        if (errores[e.target.name]) {
            setErrores((prev) => ({
                ...prev,
                [e.target.name]: undefined
            }));
        }

        setMensajeGeneral("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMensajeGeneral("");

        const datosLimpios = {
            usuario: (usuario.usuario || "").trim(),
            password: usuario.password || "",
            nombre: (usuario.nombre || "").trim(),
            apellido: (usuario.apellido || "").trim(),
            email: (usuario.email || "").trim(),
            nCelular: (usuario.nCelular || "").trim(),
            rol: usuario.rol || "Empleado"
        };

        const erroresValidacion = validar(datosLimpios);

        if (Object.keys(erroresValidacion).length > 0) {
            setErrores(erroresValidacion);
            setMensajeGeneral(
                "Completa los campos obligatorios e intenta nuevamente."
            );
            return;
        }

        setGuardando(true);

        try {

            const res = await guardarUsuario(datosLimpios);

            if (res && res.success) {

                alert("Usuario registrado con éxito.");

                recargar();

            } else {

                setMensajeGeneral(
                    res?.message ||
                    "No fue posible registrar el usuario. Inténtalo nuevamente."
                );

            }

        } catch (error) {

            console.error("Error al registrar usuario:", error);

            setMensajeGeneral(
                "No fue posible conectar con el servidor. Inténtalo nuevamente."
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

                <form onSubmit={handleSubmit} noValidate>

                    {mensajeGeneral && (
                        <div className="alert alert-danger py-2" role="alert">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {mensajeGeneral}
                        </div>
                    )}

                    <div className="row g-3">

                        {/* USUARIO */}
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Usuario{" "}
                                <span className="text-danger">*</span>
                            </label>

                            <input
                                type="text"
                                className={
                                    "form-control" +
                                    (errores.usuario ? " is-invalid" : "")
                                }
                                name="usuario"
                                placeholder="Ej. jperez"
                                value={usuario.usuario}
                                onChange={handleChange}
                                required
                            />

                            {errores.usuario && (
                                <div className="invalid-feedback">
                                    {errores.usuario}
                                </div>
                            )}

                        </div>

                        {/* CONTRASEÑA */}
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Contraseña{" "}
                                <span className="text-danger">*</span>
                            </label>

                            <input
                                type="password"
                                className={
                                    "form-control" +
                                    (errores.password ? " is-invalid" : "")
                                }
                                name="password"
                                placeholder="Mínimo 6 caracteres"
                                value={usuario.password}
                                onChange={handleChange}
                                required
                            />

                            {errores.password && (
                                <div className="invalid-feedback">
                                    {errores.password}
                                </div>
                            )}

                        </div>

                        {/* NOMBRE */}
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Nombre{" "}
                                <span className="text-danger">*</span>
                            </label>

                            <input
                                type="text"
                                className={
                                    "form-control" +
                                    (errores.nombre ? " is-invalid" : "")
                                }
                                name="nombre"
                                placeholder="Ej. Juan"
                                value={usuario.nombre}
                                onChange={handleChange}
                                required
                            />

                            {errores.nombre && (
                                <div className="invalid-feedback">
                                    {errores.nombre}
                                </div>
                            )}

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
                                className={
                                    "form-control" +
                                    (errores.email ? " is-invalid" : "")
                                }
                                name="email"
                                placeholder="usuario@correo.com"
                                value={usuario.email}
                                onChange={handleChange}
                            />

                            {errores.email && (
                                <div className="invalid-feedback">
                                    {errores.email}
                                </div>
                            )}

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
                                className={
                                    "form-select" +
                                    (errores.rol ? " is-invalid" : "")
                                }
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

                            {errores.rol && (
                                <div className="invalid-feedback">
                                    {errores.rol}
                                </div>
                            )}

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