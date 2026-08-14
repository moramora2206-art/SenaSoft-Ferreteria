import { useEffect, useState } from "react";
import { listarClientes, eliminarCliente } from "../services/clienteService";

function ClienteList({ editar, actualizar, onNuevo }) {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    const cargarClientes = async () => {
        try {
            setCargando(true);
            const res = await listarClientes(busqueda);
            if (res && res.success) {
                setClientes(res.data || []);
            }
        } catch (error) {
            console.error("Error al cargar clientes", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarClientes();
    }, [actualizar]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        cargarClientes();
    };

    const eliminar = async (id, nombre) => {
        if (!window.confirm(`¿Está seguro de eliminar al cliente "${nombre}"?`)) return;

        try {
            const res = await eliminarCliente(id);
            if (res.success) {
                alert("Cliente eliminado correctamente.");
                cargarClientes();
            } else {
                alert(res.message || "No se pudo eliminar el cliente.");
            }
        } catch (err) {
            alert("Error al eliminar el cliente.");
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
                <div className="row g-3 align-items-center">
                    <div className="col-12 col-md-6">
                        <h5 className="fw-bold mb-0 text-dark">
                            <i className="bi bi-people text-warning me-2"></i>
                            Directorio de Clientes ({clientes.length})
                        </h5>
                    </div>

                    <div className="col-12 col-md-6">
<<<<<<< HEAD
                        <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                            <form onSubmit={handleSearchSubmit} className="d-flex gap-2 flex-grow-1">
=======
                        <div className="d-flex gap-2 justify-content-md-end">
                            <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Buscar por nombre, cédula..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                                <button type="submit" className="btn btn-sm btn-outline-secondary">
                                    <i className="bi bi-search"></i>
                                </button>
                            </form>

                            <button className="btn btn-sm btn-warning text-dark fw-bold" onClick={onNuevo}>
                                <i className="bi bi-person-plus me-1"></i> Nuevo Cliente
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-body p-0">
                {cargando ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-warning" role="status"></div>
                        <p className="mt-2 text-muted">Cargando clientes...</p>
                    </div>
                ) : clientes.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-person-slash fs-1 d-block mb-2"></i>
                        No se encontraron clientes registrados.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Cédula / NIT</th>
                                    <th>Teléfono</th>
                                    <th>Correo Electrónico</th>
                                    <th>Dirección</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map((c) => (
                                    <tr key={c.idCliente}>
                                        <td><span className="fw-bold text-muted">#{c.idCliente}</span></td>
                                        <td className="fw-semibold">{c.nombre} {c.apellido}</td>
                                        <td><code>{c.cedula}</code></td>
                                        <td>{c.nCelular || "-"}</td>
                                        <td>{c.email || "-"}</td>
                                        <td><small className="text-muted">{c.direccion || "-"}</small></td>
                                        <td className="text-center">
                                            <div className="btn-group btn-group-sm">
                                                <button className="btn btn-outline-primary" onClick={() => editar(c)} title="Editar cliente">
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="btn btn-outline-danger" onClick={() => eliminar(c.idCliente, `${c.nombre} ${c.apellido}`)} title="Eliminar cliente">
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClienteList;