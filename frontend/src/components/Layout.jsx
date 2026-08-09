import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

function Layout({ children }) {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar />
            <div className="d-flex flex-grow-1">
                <Sidebar />
                <main className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: "#f8fafc" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;