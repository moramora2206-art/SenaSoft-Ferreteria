import { useState } from "react";

import UsuarioForm from "../components/UsuarioForm";
import UsuarioList from "../components/UsuarioList";
import UsuarioEdit from "../components/UsuarioEdit";

function Usuarios() {

<<<<<<< HEAD
    const [modo, setModo] = useState("lista");

=======
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    const [usuarioEditar, setUsuarioEditar] = useState(null);

    const [actualizar, setActualizar] = useState(false);

    const recargar = () => {

<<<<<<< HEAD
        setModo("lista");

        setUsuarioEditar(null);

        setActualizar((prev) => !prev);

    };

    const handleNuevo = () => {

        setUsuarioEditar(null);

        setModo("crear");

    };

    const handleEditar = (usuario) => {

        setUsuarioEditar(usuario);

        setModo("editar");

    };

    const cancelar = () => {

        setUsuarioEditar(null);

        setModo("lista");

=======
        setActualizar(!actualizar);

        setUsuarioEditar(null);

>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    };

    return (

        <div className="container-fluid">

<<<<<<< HEAD
            <div className="mb-4">

                <h2 className="fw-bold mb-1 text-dark">

                    <i className="bi bi-people text-warning me-2"></i>

                    Gestión de Usuarios

                </h2>

                <p className="text-muted mb-0">

                    Administración de usuarios, datos personales y roles del sistema.

                </p>

            </div>

            {modo === "crear" && (

                <UsuarioForm
                    recargar={recargar}
                    cancelar={cancelar}
                />

            )}

            {modo === "editar" && usuarioEditar && (

                <UsuarioEdit
                    usuario={usuarioEditar}
                    recargar={recargar}
                    cancelar={cancelar}
                />

            )}

            {modo === "lista" && (

                <UsuarioList
                    editar={handleEditar}
                    actualizar={actualizar}
                    onNuevo={handleNuevo}
                />

            )}
=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566

        </div>

    );

}

export default Usuarios;