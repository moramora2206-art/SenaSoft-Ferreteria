import api, { normalizarErrorApi } from "./api";

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
    try {
        const response = await api.post("/proveedores.php", proveedor);
        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo registrar el proveedor.");
    }
};

export const actualizarProveedor = async (proveedor) => {
    try {
        const response = await api.put("/proveedores.php", proveedor);
        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo actualizar el proveedor.");
    }
};

export const eliminarProveedor = async (id) => {
    try {
        const response = await api.delete(`/proveedores.php?id=${id}`);
        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo eliminar el proveedor.");
    }
};