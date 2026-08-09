import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptor para inyectar token o usuario si está guardado en localStorage
api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem("ferreteria_user");
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user && user.id) {
                config.headers["X-User-Id"] = user.id;
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
