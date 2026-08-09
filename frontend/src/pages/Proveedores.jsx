import { useState } from "react";

import ProveedorForm from "../components/ProveedorForm";
import ProveedorList from "../components/ProveedorList";
import ProveedorEdit from "../components/ProveedorEdit";

function Proveedores() {

    const [proveedorEditar, setProveedorEditar] = useState(null);

    const [actualizar, setActualizar] = useState(false);

    const recargar = () => {

        setActualizar(!actualizar);

        setProveedorEditar(null);

    };

    return (

        <div className="container-fluid">

            <h1 className="mb-4">
                Gestión de Proveedores
            </h1>

            <ProveedorForm recargar={recargar} />

            <ProveedorEdit
                proveedor={proveedorEditar}
                recargar={recargar}
            />

            <ProveedorList
                editar={setProveedorEditar}
                actualizar={actualizar}
            />

        </div>

    );

}

export default Proveedores;