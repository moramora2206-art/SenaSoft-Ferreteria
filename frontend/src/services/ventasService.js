import api, { normalizarErrorApi } from "./api";

export const obtenerResumenVentas = async (
    inicio,
    fin
) => {

    try {

        const response =
            await api.get(
                `/ventas.php?inicio=${inicio}&fin=${fin}`
            );

        return response.data;

    } catch (error) {

        return normalizarErrorApi(
            error,
            "No se pudo obtener el resumen de ventas."
        );
    }
};