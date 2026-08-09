import { createContext, useContext, useState, useEffect } from "react";
import { loginUsuario, logoutUsuario, getUsuarioActual } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const u = getUsuarioActual();
        if (u) {
            setUser(u);
        }
        setLoading(false);
    }, []);

    const login = async (usuario, password) => {
        const res = await loginUsuario(usuario, password);
        if (res.success) {
            setUser(res.data);
        }
        return res;
    };

    const logout = () => {
        logoutUsuario();
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
