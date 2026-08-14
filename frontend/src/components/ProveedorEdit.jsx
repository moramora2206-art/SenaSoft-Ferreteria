import { useEffect, useState } from "react";

import {
    actualizarProveedor
} from "../services/proveedorService";

function ProveedorEdit({
    proveedor,
    recargar,
    cancelar
}) {

    const [datos, setDatos] = useState({
        nombreProveedor: "",
        nit: "",
        nombreContacto: "",
        nCelular: "",
        email: ""
    });

    const [guardando, setGuardando] = useState(false);

    useEffect(() => {

        if (proveedor) {
            setDatos({
                ...proveedor
            });
        }

    }, [proveedor]);

    if (!proveedor) {
        return null;
    }

    const handleChange = (e) => {

        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setGuardando(true);

        try {

            const res = await actualizarProveedor(datos);

            if (res && res.success) {

                alert("Proveedor actualizado correctamente.");

                recargar();

            } else {

                alert(
                    res?.message ||
                    "No se pudo actualizar el proveedor."
                );

            }

        } catch (error) {

            console.error(
                "Error al actualizar proveedor:",
                error
            );

            alert(
                "Error al intentar actualizar el proveedor."
            );

        } finally {

            setGuardando(false);

        }

    };

    return (

        <div className="card shadow border-0 mb-4">

            <div className="card-header bg-primary text-white py-3 d-flex align-items-center justify-content-between">

                <h5 className="fw-bold mb-0">

                    <i className="bi bi-pencil-square me-2"></i>

                    Editar Proveedor #{datos.idProveedor}

                </h5>

                <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={cancelar}
                    aria-label="Cerrar"
                ></button>

            </div>

            <div className="card-body p-4">

                <form onSubmit={handleSubmit}>

                    <div className="row g-3">

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Nombre de la Empresa
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="nombreProveedor"
                                value={datos.nombreProveedor || ""}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                NIT
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="nit"
                                value={datos.nit || ""}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Nombre del Contacto
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="nombreContacto"
                                value={datos.nombreContacto || ""}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Teléfono / Celular
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="nCelular"
                                value={datos.nCelular || ""}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="col-12">

                            <label className="form-label fw-semibold">
                                Correo Electrónico
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={datos.email || ""}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelar}
                            disabled={guardando}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary fw-bold"
                            disabled={guardando}
                        >

                            {guardando ? (

                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                    ></span>

                                    Guardando...

                                </>

                            ) : (

                                <>
                                    <i className="bi bi-check-lg me-1"></i>
                                    Actualizar Proveedor
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default ProveedorEdit;