import api, { normalizarErrorApi } from "./api";

export const obtenerMetricasDashboard = async () => {
    try {
        const response = await api.get("/dashboard.php");
        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudieron obtener las métricas.");
    }
};