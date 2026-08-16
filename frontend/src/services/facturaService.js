import api, { normalizarErrorApi } from "./api";

export const listarFacturas = async () => {
    const response = await api.get("/facturas.php");

    if (response.data?.success) {
        return Array.isArray(response.data.data)
            ? response.data.data
            : [];
    }

    return [];
};


export const buscarFactura = async (id) => {
    const response =
        await api.get(`/facturas.php?id=${id}`);

    return response.data;
};


export const guardarFactura = async (factura) => {
    try {
        const response =
            await api.post("/facturas.php", factura);

        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo registrar la factura.");
    }
};


export const anularFactura = async (id) => {
    try {
        const response =
            await api.delete(`/facturas.php?id=${id}`);

        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo anular la factura.");
    }
};