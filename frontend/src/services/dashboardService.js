import api from "./api";

export const obtenerMetricasDashboard = async () => {
    const response = await api.get("/dashboard.php");
    return response.data;
};
