import api from "./api";

export const listarUsuarios = async () => {
    const response = await api.get("/usuarios.php");

    if (response.data?.success) {
        return Array.isArray(response.data.data)
            ? response.data.data
            : [];
    }

    return [];
};

export const buscarUsuario = async (id) => {
    const response = await api.get(`/usuarios.php?id=${id}`);
    return response.data;
};

export const guardarUsuario = async (usuario) => {
    const response = await api.post("/usuarios.php", usuario);
    return response.data;
};

export const actualizarUsuario = async (usuario) => {
    const response = await api.put("/usuarios.php", usuario);
    return response.data;
};

export const eliminarUsuario = async (id) => {
    const response = await api.delete(`/usuarios.php?id=${id}`);
    return response.data;
};