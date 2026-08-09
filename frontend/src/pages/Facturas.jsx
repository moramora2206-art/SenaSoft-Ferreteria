import { useState } from "react";

import FacturaForm from "../components/FacturaForm";
import FacturaList from "../components/FacturaList";
import FacturaEdit from "../components/FacturaEdit";

function Facturas() {
    const [facturaEditar, setFacturaEditar] = useState(null);
    const [actualizar, setActualizar] = useState(false);

    const recargar = () => {
        setActualizar((v) => !v);
        setFacturaEditar(null);
    };

    const cerrarDetalle = () => setFacturaEditar(null);

    return (
        <div className="container-fluid">
            <h1 className="mb-4">
                <i className="bi bi-receipt me-2 text-primary"></i>
                Gestión de Facturas
            </h1>

            <FacturaForm recargar={recargar} />

            {facturaEditar && (
                <FacturaEdit
                    facturaId={
                        typeof facturaEditar === "object"
                            ? facturaEditar.idFactura
                            : facturaEditar
                    }
                    recargar={recargar}
                    cerrar={cerrarDetalle}
                />
            )}

            <FacturaList
                editar={setFacturaEditar}
                actualizar={actualizar}
            />
        </div>
    );
}

export default Facturas;