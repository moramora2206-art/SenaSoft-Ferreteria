import { createContext, useContext, useState, useEffect } from "react";
import {
    loginUsuario,
    logoutUsuario,
    getUsuarioActual,
    obtenerUsuarioSesion
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let activo = true;

        const cargarSesion = async () => {
            const usuarioLocal = getUsuarioActual();

            if (usuarioLocal && activo) {
                setUser(usuarioLocal);
            }

            const res = await obtenerUsuarioSesion();

            if (!activo) return;

            if (res.success) {
                setUser(res.data);
            } else if (
                res.errorCode === "INVALID_SESSION" ||
                res.errorCode === "SESSION_EXPIRED"
            ) {
                setUser(null);
            }

            setLoading(false);
        };

        cargarSesion();

        // Si la sesión expira mientras la aplicación está abierta,
        // el interceptor de api.js dispara este evento para cerrar sesión.
        const manejarExpiracion = () => {
            setUser(null);
        };

        window.addEventListener("auth:sesion-expirada", manejarExpiracion);

        return () => {
            activo = false;
            window.removeEventListener("auth:sesion-expirada", manejarExpiracion);
        };
    }, []);

    const login = async (usuario, password) => {
        const res = await loginUsuario(usuario, password);
        if (res.success) {
            sessionStorage.removeItem("ferreteria_sesion_expirada");
            setUser(res.data);
        }
        return res;
    };

    const logout = async () => {
        await logoutUsuario();
        sessionStorage.removeItem("ferreteria_sesion_expirada");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
