import api from "./api";

export const listarFacturas = async () => {
    const response = await api.get("/facturas.php");
    return response.data;
};

export const buscarFactura = async (id) => {
    const response = await api.get(`/facturas.php?id=${id}`);
    return response.data;
};

export const guardarFactura = async (factura) => {
    const response = await api.post("/facturas.php", factura);
    return response.data;
};

export const eliminarFactura = async (id) => {
    const response = await api.delete(`/facturas.php?id=${id}`);
    return response.data;
};