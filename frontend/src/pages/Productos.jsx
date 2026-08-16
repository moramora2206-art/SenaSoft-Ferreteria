import { useState } from "react";
import ProductoList from "../components/ProductoList";
import ProductoForm from "../components/ProductoForm";
import ProductoEdit from "../components/ProductoEdit";

function Productos() {

    const [modo, setModo] = useState("lista");
    const [productoEditar, setProductoEditar] = useState(null);
    const [actualizar, setActualizar] = useState(false);

    const recargarLista = () => {
        setModo("lista");
        setProductoEditar(null);
        setActualizar((prev) => !prev);
    };

    const handleEditar = (producto) => {
        setProductoEditar(producto);
        setModo("editar");
    };

    const handleNuevo = () => {
        setProductoEditar(null);
        setModo("crear");
    };

    const cancelar = () => {
        setProductoEditar(null);
        setModo("lista");
    };

    return (
        <div className="container-fluid">

            {modo === "lista" && (
                <div className="mb-4">
                    <h2 className="fw-bold mb-1 text-dark">
                        <i className="bi bi-box-seam text-warning me-2"></i>
                        Gestión de Productos e Inventario
                    </h2>

                    <p className="text-muted mb-0">
                        Control integral de existencias, precios, categorías e imágenes para ferretería.
                    </p>
                </div>
            )}

            {modo === "crear" && (
                <ProductoForm
                    recargar={recargarLista}
                    cancelar={cancelar}
                />
            )}

            {modo === "editar" && productoEditar && (
                <ProductoEdit
                    productoSeleccionado={productoEditar}
                    recargar={recargarLista}
                    cancelar={cancelar}
                />
            )}

            {modo === "lista" && (
                <ProductoList
                    editar={handleEditar}
                    actualizar={actualizar}
                    onNuevo={handleNuevo}
                />
            )}

        </div>
    );
}

export default Productos;