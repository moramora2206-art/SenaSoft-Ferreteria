import api from "./api";

export const loginUsuario = async (usuario, password) => {
    const response = await api.post("/login.php", { usuario, password });
    if (response.data && response.data.success) {
        localStorage.setItem("ferreteria_user", JSON.stringify(response.data.data));
    }
    return response.data;
};

export const logoutUsuario = () => {
    localStorage.removeItem("ferreteria_user");
};

export const getUsuarioActual = () => {
    const userStr = localStorage.getItem("ferreteria_user");
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};
