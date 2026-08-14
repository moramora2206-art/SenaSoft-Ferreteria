import { createContext, useContext, useState, useEffect } from "react";
<<<<<<< HEAD
import {
    loginUsuario,
    logoutUsuario,
    getUsuarioActual,
    obtenerUsuarioSesion
} from "../services/authService";
=======
import { loginUsuario, logoutUsuario, getUsuarioActual } from "../services/authService";
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
<<<<<<< HEAD
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
=======
        const u = getUsuarioActual();
        if (u) {
            setUser(u);
        }
        setLoading(false);
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    }, []);

    const login = async (usuario, password) => {
        const res = await loginUsuario(usuario, password);
        if (res.success) {
            setUser(res.data);
        }
        return res;
    };

<<<<<<< HEAD
    const logout = async () => {
        await logoutUsuario();
=======
    const logout = () => {
        logoutUsuario();
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
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
