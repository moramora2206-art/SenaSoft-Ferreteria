import api from "./api";

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
    const response =
        await api.post("/facturas.php", factura);

    return response.data;
};


export const anularFactura = async (id) => {
    const response =
        await api.delete(`/facturas.php?id=${id}`);

    return response.data;
};