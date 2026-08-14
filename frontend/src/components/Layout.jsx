<<<<<<< HEAD
import { useState } from "react";
=======
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

function Layout({ children }) {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

<<<<<<< HEAD
    const [sidebarAbierto, setSidebarAbierto] = useState(true);

=======
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
<<<<<<< HEAD

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

=======
            <Navbar />
            <div className="d-flex flex-grow-1">
                <Sidebar />
                <main className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: "#f8fafc" }}>
                    {children}
                </main>
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
            </div>
        </div>
    );
}

export default Layout;