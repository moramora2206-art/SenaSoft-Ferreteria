import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ onToggleSidebar, sidebarAbierto }) {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3 py-2 border-bottom border-secondary">

            <div className="container-fluid">

                {/* Botón Sidebar */}
                <button
                    type="button"
                    className="btn btn-dark me-2 sidebar-toggle"
                    onClick={onToggleSidebar}
                    title={sidebarAbierto ? "Contraer menú" : "Expandir menú"}
                >
                    <i
                        className={`bi ${
                            sidebarAbierto
                                ? "bi-layout-sidebar-inset"
                                : "bi-list"
                        } fs-4`}
                    ></i>
                </button>

                {/* Logo */}
                <Link
                    className="navbar-brand d-flex align-items-center gap-2 fw-bold text-warning"
                    to="/"
                >
                    <i className="bi bi-tools fs-4"></i>

                    <span className="d-none d-sm-inline">
                        Ferretería El Constructor
                    </span>
                </Link>

                <div className="d-flex align-items-center gap-3 ms-auto">

                    {user ? (
                        <>
                            <div className="d-flex align-items-center text-light gap-2">

                                <div
                                    className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                    style={{
                                        width: "36px",
                                        height: "36px"
                                    }}
                                >
                                    {user.nombre
                                        ? user.nombre.charAt(0).toUpperCase()
                                        : "U"}
                                </div>

                                <div className="d-none d-md-block text-start">

                                    <div className="fw-semibold lh-1">
                                        {user.nombre} {user.apellido}
                                    </div>

                                    <span
                                        className={`badge ${
                                            user.rol === "Administrador"
                                                ? "bg-warning text-dark"
                                                : "bg-info text-dark"
                                        } mt-1`}
                                        style={{ fontSize: "10px" }}
                                    >
                                        {user.rol || "Empleado"}
                                    </span>

                                </div>

                            </div>

                            <button
                                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                                onClick={handleLogout}
                                title="Cerrar sesión"
                            >
                                <i className="bi bi-box-arrow-right"></i>

                                <span className="d-none d-sm-inline">
                                    Salir
                                </span>
                            </button>
                        </>
                    ) : (
                        <Link
                            className="btn btn-warning btn-sm fw-bold"
                            to="/login"
                        >
                            Iniciar Sesión
                        </Link>
                    )}

                </div>

            </div>
        </nav>
    );
}

export default Navbar;
