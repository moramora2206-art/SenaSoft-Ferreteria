import api from "./api";

export const listarClientes = async (busqueda = "") => {
    const params = busqueda ? `?busqueda=${encodeURIComponent(busqueda)}` : "";
    const response = await api.get(`/clientes.php${params}`);
    return response.data;
};

export const buscarCliente = async (id) => {
    const response = await api.get(`/clientes.php?id=${id}`);
    return response.data;
};

export const guardarCliente = async (cliente) => {
    const response = await api.post("/clientes.php", cliente);
    return response.data;
};

export const actualizarCliente = async (cliente) => {
    const response = await api.put("/clientes.php", cliente);
    return response.data;
};

export const eliminarCliente = async (id) => {
    const response = await api.delete(`/clientes.php?id=${id}`);
    return response.data;
};