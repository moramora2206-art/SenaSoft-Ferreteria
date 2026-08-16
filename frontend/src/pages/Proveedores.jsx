import { useState } from "react";

import ProveedorForm from "../components/ProveedorForm";
import ProveedorList from "../components/ProveedorList";
import ProveedorEdit from "../components/ProveedorEdit";

function Proveedores() {
    const [modo, setModo] = useState("lista");
    const [proveedorEditar, setProveedorEditar] = useState(null);
    const [actualizar, setActualizar] = useState(false);

    const recargarLista = () => {
        setModo("lista");
        setProveedorEditar(null);
        setActualizar((v) => !v);
    };

    const handleNuevo = () => {
        setProveedorEditar(null);
        setModo("crear");
    };

    const handleEditar = (proveedor) => {
        setProveedorEditar(proveedor);
        setModo("editar");
    };

    const cancelar = () => {
        setProveedorEditar(null);
        setModo("lista");
    };

    return (
        <div className="container-fluid">

            {modo === "lista" && (
                <div className="mb-4">
                    <h2 className="fw-bold mb-1 text-dark">
                        <i className="bi bi-truck text-warning me-2"></i>
                        Gestión de Proveedores
                    </h2>

                    <p className="text-muted mb-0">
                        Administración de proveedores y contactos de la ferretería.
                    </p>
                </div>
            )}

            {modo === "crear" && (
                <ProveedorForm
                    recargar={recargarLista}
                    cancelar={cancelar}
                />
            )}

            {modo === "editar" && proveedorEditar && (
                <ProveedorEdit
                    proveedor={proveedorEditar}
                    recargar={recargarLista}
                    cancelar={cancelar}
                />
            )}

            {modo === "lista" && (
                <ProveedorList
                    editar={handleEditar}
                    actualizar={actualizar}
                    onNuevo={handleNuevo}
                />
            )}

        </div>
    );
}

export default Proveedores;