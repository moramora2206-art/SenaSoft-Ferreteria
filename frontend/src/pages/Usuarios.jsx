import { useState } from "react";

import UsuarioForm from "../components/UsuarioForm";
import UsuarioList from "../components/UsuarioList";
import UsuarioEdit from "../components/UsuarioEdit";

function Usuarios() {

    const [usuarioEditar, setUsuarioEditar] = useState(null);

    const [actualizar, setActualizar] = useState(false);

    const recargar = () => {

        setActualizar(!actualizar);

        setUsuarioEditar(null);

    };

    return (

        <div className="container-fluid">

            <h1 className="mb-4">
                Gestión de Usuarios
            </h1>

            <UsuarioForm recargar={recargar} />

            <UsuarioEdit
                usuario={usuarioEditar}
                recargar={recargar}
            />

            <UsuarioList
                editar={setUsuarioEditar}
                actualizar={actualizar}
            />

        </div>

    );

}

export default Usuarios;