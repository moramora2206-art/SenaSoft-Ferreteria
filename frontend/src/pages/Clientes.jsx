import { useState } from "react";

import ClienteForm from "../components/ClienteForm";
import ClienteList from "../components/ClienteList";
import ClienteEdit from "../components/ClienteEdit";

function Clientes() {
<<<<<<< HEAD
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
=======

    const [clienteEditar, setClienteEditar] = useState(null);

    const [actualizar, setActualizar] = useState(false);

    const recargar = () => {
        setActualizar(!actualizar);
        setClienteEditar(null);
    };

    return (

        <div className="container-fluid">

            <h1 className="mb-4">
                Gestión de Clientes
            </h1>

            <ClienteForm
                recargar={recargar}
            />

            <ClienteEdit
                cliente={clienteEditar}
                recargar={recargar}
            />

            <ClienteList
                editar={setClienteEditar}
                actualizar={actualizar}
            />

        </div>

    );

>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
}

export default Clientes;