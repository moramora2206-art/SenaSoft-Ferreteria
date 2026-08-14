import { useState } from "react";

import ClienteForm from "../components/ClienteForm";
import ClienteList from "../components/ClienteList";
import ClienteEdit from "../components/ClienteEdit";

function Clientes() {
    const [modo, setModo] = useState("lista");
    const [clienteEditar, setClienteEditar] = useState(null);
    const [actualizar, setActualizar] = useState(false);

    const recargarLista = () => {
        setModo("lista");
        setClienteEditar(null);
        setActualizar(!actualizar);
    };

    const handleEditar = (cliente) => {
        setClienteEditar(cliente);
        setModo("editar");
    };

    const handleNuevo = () => {
        setModo("crear");
    };

    return (
        <div className="container-fluid">

            <div className="mb-4">
                <h2 className="fw-bold mb-1 text-dark">
                    <i className="bi bi-people text-warning me-2"></i>
                    Gestión de Clientes
                </h2>

                <p className="text-muted mb-0">
                    Administración de clientes registrados en la ferretería.
                </p>
            </div>

            {modo === "crear" && (
                <ClienteForm
                    recargar={recargarLista}
                    cancelar={() => setModo("lista")}
                />
            )}

            {modo === "editar" && clienteEditar && (
                <ClienteEdit
                    clienteSeleccionado={clienteEditar}
                    recargar={recargarLista}
                    cancelar={() => setModo("lista")}
                />
            )}

            <ClienteList
                editar={handleEditar}
                actualizar={actualizar}
                onNuevo={handleNuevo}
            />

        </div>
    );
}

export default Clientes;