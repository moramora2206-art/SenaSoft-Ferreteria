import { useState } from "react";
<<<<<<< HEAD

=======
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
import ProductoList from "../components/ProductoList";
import ProductoForm from "../components/ProductoForm";
import ProductoEdit from "../components/ProductoEdit";

function Productos() {
<<<<<<< HEAD

    const [modo, setModo] = useState("lista");
=======
    const [modo, setModo] = useState("lista"); // 'lista' | 'crear' | 'editar'
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    const [productoEditar, setProductoEditar] = useState(null);
    const [actualizar, setActualizar] = useState(false);

    const recargarLista = () => {
        setModo("lista");
        setProductoEditar(null);
<<<<<<< HEAD
        setActualizar((prev) => !prev);
=======
        setActualizar(!actualizar);
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    };

    const handleEditar = (producto) => {
        setProductoEditar(producto);
        setModo("editar");
    };

    const handleNuevo = () => {
<<<<<<< HEAD
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
=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566

            {modo === "crear" && (
                <ProductoForm
                    recargar={recargarLista}
<<<<<<< HEAD
                    cancelar={cancelar}
=======
                    cancelar={() => setModo("lista")}
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
                />
            )}

            {modo === "editar" && productoEditar && (
                <ProductoEdit
                    productoSeleccionado={productoEditar}
                    recargar={recargarLista}
<<<<<<< HEAD
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

=======
                    cancelar={() => setModo("lista")}
                />
            )}

            <ProductoList
                editar={handleEditar}
                actualizar={actualizar}
                onNuevo={handleNuevo}
            />
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        </div>
    );
}

export default Productos;