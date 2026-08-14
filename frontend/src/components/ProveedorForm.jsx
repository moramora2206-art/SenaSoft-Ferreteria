import { useState } from "react";

import {
    guardarProveedor
} from "../services/proveedorService";

function ProveedorForm({ recargar, cancelar }) {

    const [proveedor, setProveedor] = useState({
        nombreProveedor: "",
        nit: "",
        nombreContacto: "",
        nCelular: "",
        email: ""
    });

    const [guardando, setGuardando] = useState(false);

    const handleChange = (e) => {
        setProveedor({
            ...proveedor,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setGuardando(true);

        try {
            const res = await guardarProveedor(proveedor);

            if (res && res.success) {
                alert("Proveedor registrado correctamente.");
                recargar();
            } else {
                alert(
                    res?.message ||
                    "No se pudo registrar el proveedor."
                );
            }

        } catch (error) {
            console.error("Error al registrar proveedor:", error);

            alert(
                "Error al conectar con el servidor."
            );

        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="card shadow border-0 mb-4">

            <div className="card-header bg-warning text-dark py-3 d-flex align-items-center justify-content-between">

                <h5 className="fw-bold mb-0">
                    <i className="bi bi-truck me-2"></i>
                    Registrar Nuevo Proveedor
                </h5>

                <button
                    type="button"
                    className="btn-close"
                    onClick={cancelar}
                    aria-label="Cerrar"
                ></button>

            </div>

            <div className="card-body p-4">

                <form onSubmit={handleSubmit}>

                    <div className="row g-3">

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Nombre de la Empresa{" "}
                                <span className="text-danger">*</span>
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="nombreProveedor"
                                placeholder="Ej. Ferretería Industrial S.A.S."
                                value={proveedor.nombreProveedor}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                NIT{" "}
                                <span className="text-danger">*</span>
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="nit"
                                placeholder="Ej. 900123456-7"
                                value={proveedor.nit}
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
                                placeholder="Ej. Carlos Rodríguez"
                                value={proveedor.nombreContacto}
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
                                placeholder="Ej. 3112223344"
                                value={proveedor.nCelular}
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
                                placeholder="proveedor@correo.com"
                                value={proveedor.email}
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
                            className="btn btn-warning text-dark fw-bold"
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
                                    Guardar Proveedor
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default ProveedorForm;