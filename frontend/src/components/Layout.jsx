import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

function Layout({ children }) {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    const [sidebarAbierto, setSidebarAbierto] = useState(true);

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">

            <Navbar
                onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
                sidebarAbierto={sidebarAbierto}
            />

            <div className="d-flex flex-grow-1 position-relative">

                <Sidebar
                    abierto={sidebarAbierto}
                    onCerrar={() => setSidebarAbierto(false)}
                />

                <main
                    className="flex-grow-1 p-4 overflow-auto"
                    style={{
                        backgroundColor: "#f8fafc",
                        minWidth: 0
                    }}
                >
                    {children}
                </main>

                {/* Fondo oscuro solamente en celular */}
                {sidebarAbierto && (
                    <div
                        className="sidebar-overlay d-lg-none"
                        onClick={() => setSidebarAbierto(false)}
                    ></div>
                )}

            </div>
        </div>
    );
}

export default Layout;