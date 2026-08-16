import { useState, useEffect } from "react";
import { actualizarCliente } from "../services/clienteService";

function ClienteEdit({ clienteSeleccionado, recargar, cancelar }) {
    const [cliente, setCliente] = useState({ ...clienteSeleccionado });
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        setCliente({ ...clienteSeleccionado });
    }, [clienteSeleccionado]);

    const handleChange = (e) => {
        setCliente({
            ...cliente,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const datos = {
            ...cliente,
            nombre: (cliente.nombre || "").trim(),
            apellido: (cliente.apellido || "").trim(),
            cedula: (cliente.cedula || "").trim(),
            nCelular: (cliente.nCelular || "").trim(),
            email: (cliente.email || "").trim(),
            direccion: (cliente.direccion || "").trim()
        };

        if (datos.nombre === "" || datos.cedula === "") {
            alert("Nombre y Cédula/NIT son requeridos.");
            return;
        }

        if (datos.email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
            alert("El correo electrónico no es válido.");
            return;
        }

        setGuardando(true);

        try {
            const res = await actualizarCliente(datos);
            if (res.success) {
                alert("Cliente actualizado correctamente.");
                recargar();
            } else {
                alert(res.message || "Error al actualizar cliente.");
            }
        } catch (error) {
            console.error(error);
            alert("Error al intentar actualizar el cliente.");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="card shadow border-0 mb-4">
            <div className="card-header bg-primary text-white py-3 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Cliente #{cliente.idCliente}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={cancelar}></button>
            </div>

            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={cliente.nombre || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Apellido / Razón Social</label>
                            <input
                                type="text"
                                className="form-control"
                                name="apellido"
                                value={cliente.apellido || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Cédula / NIT</label>
                            <input
                                type="text"
                                className="form-control"
                                name="cedula"
                                value={cliente.cedula || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Teléfono</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nCelular"
                                value={cliente.nCelular || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={cliente.email || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Dirección</label>
                            <input
                                type="text"
                                className="form-control"
                                name="direccion"
                                value={cliente.direccion || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                        <button type="button" className="btn btn-secondary" onClick={cancelar}>Cancelar</button>
                        <button type="submit" className="btn btn-primary fw-bold" disabled={guardando}>
                            {guardando ? "Guardando..." : "Actualizar Cliente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ClienteEdit;