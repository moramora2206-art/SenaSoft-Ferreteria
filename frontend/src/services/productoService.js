import api, { API_BASE_URL } from "./api";
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
<<<<<<< HEAD
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
=======
    const response = await api.get(`/productos.php?id=${id}`);
    return response.data;
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
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

    // Use axios directly to avoid JSON Content-Type
    const response = await axios.post(postUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
<<<<<<< HEAD
        },
        withCredentials: true
=======
        }
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    });

    return response.data;
};

// Registrar entrada de stock
export const registrarEntradaStock = async (idProducto, cantidad) => {
    const payload = { idProducto: Number(idProducto), cantidad: Number(cantidad) };
    const response = await api.post("/productos/entrada_stock.php", payload);
    return response.data;
};
