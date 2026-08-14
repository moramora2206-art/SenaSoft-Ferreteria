import { NavLink } from "react-router-dom";

<<<<<<< HEAD
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
=======
function Sidebar() {
    return (
        <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: "260px", minHeight: "calc(100vh - 56px)" }}>
            <div className="text-uppercase text-muted fw-bold mb-3 px-2" style={{ fontSize: "11px", letterSpacing: "1px" }}>
                Módulos del Sistema
            </div>

            <div className="d-flex flex-column gap-1">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded transition ${isActive ? "bg-warning text-dark fw-bold shadow-sm" : "text-light hover-bg-secondary"}`
                    }
                >
                    <i className="bi bi-speedometer2 fs-5"></i>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/productos"
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded transition ${isActive ? "bg-warning text-dark fw-bold shadow-sm" : "text-light hover-bg-secondary"}`
                    }
                >
                    <i className="bi bi-box-seam fs-5"></i>
                    <span>Productos e Inventario</span>
                </NavLink>

                <NavLink
                    to="/clientes"
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded transition ${isActive ? "bg-warning text-dark fw-bold shadow-sm" : "text-light hover-bg-secondary"}`
                    }
                >
                    <i className="bi bi-people fs-5"></i>
                    <span>Clientes</span>
                </NavLink>

                <NavLink
                    to="/proveedores"
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded transition ${isActive ? "bg-warning text-dark fw-bold shadow-sm" : "text-light hover-bg-secondary"}`
                    }
                >
                    <i className="bi bi-truck fs-5"></i>
                    <span>Proveedores</span>
                </NavLink>

                <NavLink
                    to="/facturas"
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded transition ${isActive ? "bg-warning text-dark fw-bold shadow-sm" : "text-light hover-bg-secondary"}`
                    }
                >
                    <i className="bi bi-receipt fs-5"></i>
                    <span>Facturación y Ventas</span>
                </NavLink>

                <NavLink
                    to="/usuarios"
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded transition ${isActive ? "bg-warning text-dark fw-bold shadow-sm" : "text-light hover-bg-secondary"}`
                    }
                >
                    <i className="bi bi-person-badge fs-5"></i>
                    <span>Usuarios</span>
                </NavLink>
            </div>

            <div className="mt-auto pt-4 px-2 text-center text-muted small border-top border-secondary">
                <div><i className="bi bi-hammer me-1 text-warning"></i> Ferretería v2.0</div>
                <div style={{ fontSize: "11px" }}>React + PHP + MySQL</div>
            </div>
        </div>
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    );
}

export default Sidebar;