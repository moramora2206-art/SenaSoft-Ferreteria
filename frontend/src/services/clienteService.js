import api, { normalizarErrorApi } from "./api";

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
    try {
        const response = await api.post("/clientes.php", cliente);
        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo registrar el cliente.");
    }
};

export const actualizarCliente = async (cliente) => {
    try {
        const response = await api.put("/clientes.php", cliente);
        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo actualizar el cliente.");
    }
};

export const eliminarCliente = async (id) => {
    try {
        const response = await api.delete(`/clientes.php?id=${id}`);
        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo eliminar el cliente.");
    }
};