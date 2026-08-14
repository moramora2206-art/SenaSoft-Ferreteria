import api from "./api";

const STORAGE_KEY = "ferreteria_user";

const normalizarErrorAuth = (error) => {
    if (error.response) {
        const { status, data } = error.response;
        const message =
            data?.message ||
            data?.mensaje ||
            "No fue posible completar la solicitud.";

        if (status === 401) {
            return {
                success: false,
                status,
                errorCode: data?.errorCode || "INVALID_CREDENTIALS",
                message
            };
        }

        if (status === 403) {
            return {
                success: false,
                status,
                errorCode: data?.errorCode || "FORBIDDEN",
                message: message || "No tiene permisos para esta operación."
            };
        }

        if (status >= 500) {
            return {
                success: false,
                status,
                errorCode: data?.errorCode || "SERVER_ERROR",
                message:
                    message ||
                    "El servidor PHP respondió con un error interno."
            };
        }

        return {
            success: false,
            status,
            errorCode: data?.errorCode || "HTTP_ERROR",
            message
        };
    }

    if (error.request) {
        return {
            success: false,
            status: 0,
            errorCode: "NETWORK_OR_CORS_ERROR",
            message:
                "No fue posible conectar con el servidor PHP. Verifique que Apache esté activo, la URL de la API sea correcta y CORS permita este origen."
        };
    }

    return {
        success: false,
        status: 0,
        errorCode: "CLIENT_ERROR",
        message: error.message || "Error inesperado en el cliente."
    };
};

export const loginUsuario = async (usuario, password) => {
    try {
        const response = await api.post("/login.php", {
            usuario: usuario.trim(),
            password
        });

        if (response.data?.success && response.data?.data) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(response.data.data)
            );
        }

        return response.data;
    } catch (error) {
        return normalizarErrorAuth(error);
    }
};

export const logoutUsuario = async () => {
    localStorage.removeItem(STORAGE_KEY);

    try {
        await api.post("/logout.php");
    } catch (error) {
        console.warn("No se pudo cerrar la sesión PHP:", error);
    }
};

export const obtenerUsuarioSesion = async () => {
    try {
        const response = await api.get("/me.php");

        if (response.data?.success && response.data?.data) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(response.data.data)
            );
        }

        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEY);
        }

        return normalizarErrorAuth(error);
    }
};

export const getUsuarioActual = () => {
    const userStr = localStorage.getItem(STORAGE_KEY);

    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
};
