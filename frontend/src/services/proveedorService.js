import api from "./api";

export const listarProveedores = async (busqueda = "") => {
    const params = busqueda ? `?busqueda=${encodeURIComponent(busqueda)}` : "";
    const response = await api.get(`/proveedores.php${params}`);
    return response.data;
};

export const buscarProveedor = async (id) => {
    const response = await api.get(`/proveedores.php?id=${id}`);
    return response.data;
};

export const guardarProveedor = async (proveedor) => {
    const response = await api.post("/proveedores.php", proveedor);
    return response.data;
};

export const actualizarProveedor = async (proveedor) => {
    const response = await api.put("/proveedores.php", proveedor);
    return response.data;
};

export const eliminarProveedor = async (id) => {
    const response = await api.delete(`/proveedores.php?id=${id}`);
    return response.data;
};