import { NavLink } from "react-router-dom";

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
    );
}

export default Sidebar;