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

export default api;
export { API_BASE_URL };
