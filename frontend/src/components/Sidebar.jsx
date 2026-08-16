import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar({ abierto, onCerrar }) {

    const { user } = useAuth();

    const cerrarEnMovil = () => {
        if (window.innerWidth < 992) {
            onCerrar();
        }
    };

    const secciones = [
        {
            titulo: "Principal",
            links: [
                {
                    to: "/",
                    icon: "bi-speedometer2",
                    texto: "Dashboard",
                    end: true
                }
            ]
        },
        {
            titulo: "Gestión",
            links: [
                {
                    to: "/productos",
                    icon: "bi-box-seam",
                    texto: "Productos e Inventario"
                },
                {
                    to: "/clientes",
                    icon: "bi-people",
                    texto: "Clientes"
                },
                {
                    to: "/proveedores",
                    icon: "bi-truck",
                    texto: "Proveedores"
                }
            ]
        },
        {
            titulo: "Ventas",
            links: [
                {
                    to: "/facturas",
                    icon: "bi-receipt",
                    texto: "Facturas"
                },
                {
                    to: "/ventas",
                    icon: "bi-graph-up-arrow",
                    texto: "Análisis de Ventas"
                }
            ]
        }
    ];

    // La gestión de usuarios es exclusiva de Administradores.
    if (user?.rol === "Administrador") {
        secciones.push({
            titulo: "Administración",
            links: [
                {
                    to: "/usuarios",
                    icon: "bi-person-badge",
                    texto: "Usuarios"
                }
            ]
        });
    }

    return (
        <aside
            className={`sidebar bg-dark text-white ${
                abierto ? "sidebar-open" : "sidebar-closed"
            }`}
        >
            <div className="sidebar-inner">

                {/* Menú organizado por secciones */}
                <nav className="sidebar-menu">

                    {secciones.map((seccion) => (
                        <div key={seccion.titulo} className="mb-2">
                            <div className="sidebar-section-title">
                                {seccion.titulo}
                            </div>

                            {seccion.links.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end={link.end}
                                    onClick={cerrarEnMovil}
                                    title={!abierto ? link.texto : ""}
                                    className={({ isActive }) =>
                                        `sidebar-link ${
                                            isActive
                                                ? "sidebar-link-active"
                                                : "sidebar-link-normal"
                                        }`
                                    }
                                >
                                    <i className={`bi ${link.icon}`}></i>

                                    <span className="sidebar-link-text">
                                        {link.texto}
                                    </span>
                                </NavLink>
                            ))}
                        </div>
                    ))}

                </nav>

                {/* Pie */}
                <div className="sidebar-footer">

                    <div>
                        <i className="bi bi-hammer text-warning"></i>

                        <span className="sidebar-footer-text">
                            Ferretería v2.0
                        </span>
                    </div>

                    <div className="sidebar-footer-text sidebar-version">
                        React + PHP + MySQL
                    </div>

                </div>

            </div>
        </aside>
    );
}

export default Sidebar;