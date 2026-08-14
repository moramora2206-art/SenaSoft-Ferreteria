import { NavLink } from "react-router-dom";

function Sidebar({ abierto, onCerrar }) {

    const cerrarEnMovil = () => {
        if (window.innerWidth < 992) {
            onCerrar();
        }
    };

    const links = [
        {
            to: "/",
            icon: "bi-speedometer2",
            texto: "Dashboard",
            end: true
        },
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
        },
        {
            to: "/facturas",
            icon: "bi-receipt",
            texto: "Facturación y Ventas"
        },
        {
            to: "/usuarios",
            icon: "bi-person-badge",
            texto: "Usuarios"
        }
    ];

    return (
        <aside
            className={`sidebar bg-dark text-white ${
                abierto ? "sidebar-open" : "sidebar-closed"
            }`}
        >
            <div className="sidebar-inner">

                {/* Título */}
                <div className="sidebar-section-title">
                    Módulos del Sistema
                </div>

                {/* Menú */}
                <nav className="sidebar-menu">

                    {links.map((link) => (
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