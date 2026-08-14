import api from "./api";

export const obtenerResumenVentas = async (
    inicio,
    fin
) => {

    const response =
        await api.get(
            `/ventas.php?inicio=${inicio}&fin=${fin}`
        );

    return response.data;
};