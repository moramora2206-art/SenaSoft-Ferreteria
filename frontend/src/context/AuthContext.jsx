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
            } else if (res.errorCode === "INVALID_SESSION") {
                setUser(null);
            }

            setLoading(false);
        };

        cargarSesion();

        return () => {
            activo = false;
        };
    }, []);

    const login = async (usuario, password) => {
        const res = await loginUsuario(usuario, password);
        if (res.success) {
            setUser(res.data);
        }
        return res;
    };

    const logout = async () => {
        await logoutUsuario();
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
