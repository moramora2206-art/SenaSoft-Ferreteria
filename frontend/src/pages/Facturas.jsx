import { useState } from "react";

import FacturaForm from "../components/FacturaForm";
import FacturaList from "../components/FacturaList";
import FacturaEdit from "../components/FacturaEdit";

function Facturas() {
<<<<<<< HEAD

    const [modo, setModo] =
        useState("lista");

    const [facturaEditar, setFacturaEditar] =
        useState(null);

    const [actualizar, setActualizar] =
        useState(false);


    const recargar = () => {

        setActualizar(
            valor => !valor
        );

        setFacturaEditar(null);

        setModo("lista");
    };


    const handleNuevo = () => {
        setFacturaEditar(null);
        setModo("crear");
    };


    const handleVer = (factura) => {

        setFacturaEditar(
            typeof factura === "object"
                ? factura.idFactura
                : factura
        );

        setModo("detalle");
    };


    return (

        <div className="container-fluid">

            <div className="mb-4">

                <h2 className="fw-bold mb-1 text-dark">

                    <i className="bi bi-receipt text-warning me-2"></i>

                    Gestión de Facturación

                </h2>

                <p className="text-muted mb-0">
                    Registro y control de ventas realizadas.
                </p>

            </div>


            {modo === "crear" && (

                <FacturaForm
                    recargar={recargar}
                    cancelar={() =>
                        setModo("lista")
                    }
                />

            )}


            {modo === "detalle" &&
                facturaEditar && (

                <FacturaEdit
                    facturaId={facturaEditar}
                    recargar={recargar}
                    cerrar={() =>
                        setModo("lista")
                    }
                />

            )}


            {modo === "lista" && (

                <FacturaList
                    editar={handleVer}
                    actualizar={actualizar}
                    onNuevo={handleNuevo}
                />

            )}

=======
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
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        </div>
    );
}

export default Facturas;