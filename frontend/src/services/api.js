import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    `${window.location.protocol}//${window.location.hostname}:8000/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

// Interceptor para inyectar token o usuario si está guardado en localStorage
api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem("ferreteria_user");
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user?.idUsuario) {
                config.headers["X-User-Id"] = user.idUsuario;
            }
        } catch (e) {
            console.error("Error parsing stored user", e);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor de respuesta: si la sesión expiró o es inválida,
// limpia los datos locales y notifica a la aplicación para redirigir al login.
api.interceptors.response.use((response) => response, (error) => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.errorCode;

    if (
        status === 401 &&
        (errorCode === "SESSION_EXPIRED" || errorCode === "INVALID_SESSION")
    ) {
        try {
            localStorage.removeItem("ferreteria_user");

            // Solo se muestra el aviso de sesión expirada cuando la
            // sesión realmente existía y caducó por inactividad.
            if (errorCode === "SESSION_EXPIRED") {
                sessionStorage.setItem("ferreteria_sesion_expirada", "1");
            }

            window.dispatchEvent(new CustomEvent("auth:sesion-expirada"));
        } catch (e) {
            console.error("Error limpiando sesión expirada", e);
        }
    }

    return Promise.reject(error);
});

// Convierte un error de axios en una respuesta normalizada
// { success:false, status, errorCode, message } para que el frontend
// pueda mostrar response.data.message sin depender de try/catch.
export const normalizarErrorApi = (error, mensajeFallback = "No fue posible completar la solicitud.") => {
    if (error.response) {
        const { status, data } = error.response;
        return {
            success: false,
            status,
            errorCode: data?.errorCode || "HTTP_ERROR",
            message: data?.message || data?.mensaje || mensajeFallback
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

export default api;
export { API_BASE_URL };
