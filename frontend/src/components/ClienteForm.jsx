import { useState } from "react";
import { guardarCliente } from "../services/clienteService";

function ClienteForm({ recargar, cancelar }) {
    const [cliente, setCliente] = useState({
        nombre: "",
        apellido: "",
        cedula: "",
        nCelular: "",
        email: "",
        direccion: ""
    });

    const [guardando, setGuardando] = useState(false);

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
            nombre: cliente.nombre.trim(),
            apellido: cliente.apellido.trim(),
            cedula: cliente.cedula.trim(),
            nCelular: cliente.nCelular.trim(),
            email: cliente.email.trim(),
            direccion: cliente.direccion.trim()
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
            const res = await guardarCliente(datos);
            if (res.success) {
                alert("Cliente registrado con éxito.");
                recargar();
            } else {
                alert(res.message || "Error al registrar cliente.");
            }
        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor.");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="card shadow border-0 mb-4">
            <div className="card-header bg-warning text-dark py-3 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">
                    <i className="bi bi-person-plus me-2"></i>
                    Registrar Nuevo Cliente
                </h5>
                <button type="button" className="btn-close" onClick={cancelar}></button>
            </div>

            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Nombre <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                placeholder="Ej. Pedro / Constructora Bolívar"
                                value={cliente.nombre}
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
                                placeholder="Ej. Gómez (Maestro de Obra) / S.A.S."
                                value={cliente.apellido}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Cédula / NIT <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                name="cedula"
                                placeholder="1098765432 / 900111222"
                                value={cliente.cedula}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Teléfono / Celular</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nCelular"
                                placeholder="3112223344"
                                value={cliente.nCelular}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                placeholder="cliente@correo.com"
                                value={cliente.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Dirección</label>
                            <input
                                type="text"
                                className="form-control"
                                name="direccion"
                                placeholder="Calle 45 # 12-34 Barrio Centro"
                                value={cliente.direccion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                        <button type="button" className="btn btn-secondary" onClick={cancelar}>Cancelar</button>
                        <button type="submit" className="btn btn-warning text-dark fw-bold" disabled={guardando}>
                            {guardando ? "Guardando..." : "Guardar Cliente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ClienteForm;