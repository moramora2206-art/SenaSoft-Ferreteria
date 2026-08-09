import { useState } from "react";

import ClienteForm from "../components/ClienteForm";
import ClienteList from "../components/ClienteList";
import ClienteEdit from "../components/ClienteEdit";

function Clientes() {

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

}

export default Clientes;