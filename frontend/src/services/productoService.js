import api, { API_BASE_URL, normalizarErrorApi } from "./api";
import axios from "axios";

export const listarProductos = async (busqueda = "", categoria = "", idProveedor = "") => {
    const params = new URLSearchParams();
    if (busqueda) params.append("busqueda", busqueda);
    if (categoria) params.append("categoria", categoria);
    if (idProveedor) params.append("idProveedor", idProveedor);

    const response = await api.get(`/productos.php?${params.toString()}`);
    return response.data;
};

export const buscarProducto = async (id) => {
    try {
        const response = await api.get(
            `/productos.php?id=${encodeURIComponent(id)}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error buscando producto:",
            error
        );

        if (error.response?.data) {
            return error.response.data;
        }

        return {
            success: false,
            message: "No se pudo consultar el producto."
        };
    }
};

export const guardarProducto = async (producto) => {
    try {
        const response = await api.post("/productos.php", producto);
        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo guardar el producto.");
    }
};

export const actualizarProducto = async (producto) => {
    try {
        const response = await api.put("/productos.php", producto);
        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo actualizar el producto.");
    }
};

export const eliminarProducto = async (id) => {
    try {
        const response = await api.delete(`/productos.php?id=${id}`);
        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo eliminar el producto.");
    }
};

// Subir imagen (multipart/form-data) a /api/productos/upload_imagen.php
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("imagen", file);

    // Build upload URL based on API_BASE_URL
    let postUrl = API_BASE_URL;
    if (postUrl.endsWith('/api')) {
        postUrl = postUrl + '/productos/upload_imagen.php';
    } else if (postUrl.endsWith('/api/')) {
        postUrl = postUrl + 'productos/upload_imagen.php';
    } else if (postUrl.endsWith('/')) {
        postUrl = postUrl + 'api/productos/upload_imagen.php';
    } else {
        postUrl = postUrl + '/api/productos/upload_imagen.php';
    }

    try {
        // Use axios directly to avoid JSON Content-Type
        const response = await axios.post(postUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo subir la imagen.");
    }
};

// Registrar entrada de stock
export const registrarEntradaStock = async (idProducto, cantidad) => {
    try {
        const payload = { idProducto: Number(idProducto), cantidad: Number(cantidad) };
        const response = await api.post("/productos/entrada_stock.php", payload);
        return response.data;
    } catch (error) {
        return normalizarErrorApi(error, "No se pudo registrar la entrada de stock.");
    }
};