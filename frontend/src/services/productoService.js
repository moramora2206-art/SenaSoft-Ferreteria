import api from "./api";

export const listarProductos = async (busqueda = "", categoria = "", idProveedor = "") => {
    const params = new URLSearchParams();
    if (busqueda) params.append("busqueda", busqueda);
    if (categoria) params.append("categoria", categoria);
    if (idProveedor) params.append("idProveedor", idProveedor);

    const response = await api.get(`/productos.php?${params.toString()}`);
    return response.data;
};

export const buscarProducto = async (id) => {
    const response = await api.get(`/productos.php?id=${id}`);
    return response.data;
};

export const guardarProducto = async (producto) => {
    const response = await api.post("/productos.php", producto);
    return response.data;
};

export const actualizarProducto = async (producto) => {
    const response = await api.put("/productos.php", producto);
    return response.data;
};

export const eliminarProducto = async (id) => {
    const response = await api.delete(`/productos.php?id=${id}`);
    return response.data;
};