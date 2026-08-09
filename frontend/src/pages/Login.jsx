import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
    const [usuario, setUsuario] = useState("root");
    const [password, setPassword] = useState("Car*2011");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        try {
            const res = await login(usuario, password);
            if (res.success) {
                navigate("/");
            } else {
                setError(res.message || "Credenciales incorrectas.");
            }
        } catch (err) {
            console.error(err);
            setError("No fue posible conectar con el servidor PHP.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light" style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            color: "#f8fafc"
        }}>
            <div className="card shadow-lg border-0" style={{ maxWidth: "420px", width: "100%", borderRadius: "16px", backgroundColor: "#ffffff" }}>
                <div className="card-body p-4 p-sm-5 text-dark">
                    <div className="text-center mb-4">
                        <div className="bg-warning text-dark d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: "64px", height: "64px" }}>
                            <i className="bi bi-tools fs-2"></i>
                        </div>
                        <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Ferretería El Constructor</h3>
                        <p className="text-muted small">Sistema de Gestión de Inventario y Facturación</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 small d-flex align-items-center" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>{error}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Usuario</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-person text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-start-0"
                                    placeholder="Nombre de usuario"
                                    value={usuario}
                                    onChange={(e) => setUsuario(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Contraseña</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-lock text-muted"></i>
                                </span>
                                <input
                                    type="password"
                                    className="form-control bg-light border-start-0"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-warning w-100 py-2.5 fw-bold text-dark shadow-sm"
                            disabled={cargando}
                        >
                            {cargando ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                    Iniciar Sesión
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-4 pt-3 border-top text-center text-muted small">
                        <i className="bi bi-shield-check me-1 text-success"></i> Servidor API REST PHP Activo
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
