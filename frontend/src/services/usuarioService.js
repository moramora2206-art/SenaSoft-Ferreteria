import api from "./api";

const normalizarErrorUsuario = (error, fallback) => {
    if (error.response) {
        const { status, data } = error.response;
        const message =
            data?.message ||
            data?.mensaje ||
            fallback;

        return {
            success: false,
            status,
            errorCode: data?.errorCode || "SERVER_ERROR",
            message
        };
    }

    if (error.request) {
        return {
            success: false,
            status: 0,
            errorCode: "NETWORK_OR_CORS_ERROR",
            message:
                "No fue posible conectar con el servidor. Verifique que Apache esté activo y CORS permita este origen."
        };
    }

    return {
        success: false,
        status: 0,
        errorCode: "CLIENT_ERROR",
        message: error.message || fallback
    };
};

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
    try {
        const response = await api.post("/usuarios.php", usuario);
        return response.data;
    } catch (error) {
        return normalizarErrorUsuario(
            error,
            "No fue posible registrar el usuario. Inténtalo nuevamente."
        );
    }
};

export const actualizarUsuario = async (usuario) => {
    try {
        const response = await api.put("/usuarios.php", usuario);
        return response.data;
    } catch (error) {
        return normalizarErrorUsuario(
            error,
            "No fue posible actualizar el usuario. Inténtalo nuevamente."
        );
    }
};

export const eliminarUsuario = async (id) => {
    try {
        const response = await api.delete(`/usuarios.php?id=${id}`);
        return response.data;
    } catch (error) {
        return normalizarErrorUsuario(
            error,
            "No fue posible eliminar el usuario. Inténtalo nuevamente."
        );
    }
};