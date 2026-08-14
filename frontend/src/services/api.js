import axios from "axios";

<<<<<<< HEAD
const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    `${window.location.protocol}//${window.location.hostname}:8000/api`;
=======
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
<<<<<<< HEAD
    },
    withCredentials: true
=======
    }
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
});

// Interceptor para inyectar token o usuario si está guardado en localStorage
api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem("ferreteria_user");
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
<<<<<<< HEAD
            if (user?.idUsuario) {
                config.headers["X-User-Id"] = user.idUsuario;
=======
            if (user && user.id) {
                config.headers["X-User-Id"] = user.id;
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
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
