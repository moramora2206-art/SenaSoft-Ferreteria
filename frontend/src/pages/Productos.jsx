import { useState } from "react";
import ProductoList from "../components/ProductoList";
import ProductoForm from "../components/ProductoForm";
import ProductoEdit from "../components/ProductoEdit";

function Productos() {
    const [modo, setModo] = useState("lista"); // 'lista' | 'crear' | 'editar'
    const [productoEditar, setProductoEditar] = useState(null);
    const [actualizar, setActualizar] = useState(false);

    const recargarLista = () => {
        setModo("lista");
        setProductoEditar(null);
        setActualizar(!actualizar);
    };

    const handleEditar = (producto) => {
        setProductoEditar(producto);
        setModo("editar");
    };

    const handleNuevo = () => {
        setModo("crear");
    };

    return (
        <div className="container-fluid">
            <div className="mb-4">
                <h2 className="fw-bold mb-1 text-dark">
                    <i className="bi bi-box-seam text-warning me-2"></i>
                    Gestión de Productos e Inventario
                </h2>
                <p className="text-muted mb-0">Control integral de existencias, precios, categorías e imágenes para ferretería.</p>
            </div>

            {modo === "crear" && (
                <ProductoForm
                    recargar={recargarLista}
                    cancelar={() => setModo("lista")}
                />
            )}

            {modo === "editar" && productoEditar && (
                <ProductoEdit
                    productoSeleccionado={productoEditar}
                    recargar={recargarLista}
                    cancelar={() => setModo("lista")}
                />
            )}

            <ProductoList
                editar={handleEditar}
                actualizar={actualizar}
                onNuevo={handleNuevo}
            />
        </div>
    );
}

export default Productos;