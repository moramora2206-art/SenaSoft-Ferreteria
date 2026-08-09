import { useEffect, useState } from "react";

import {
    actualizarProveedor
} from "../services/proveedorService";

function ProveedorEdit({
    proveedor,
    recargar
}) {

    const [datos, setDatos] = useState(proveedor);

    useEffect(() => {
        setDatos(proveedor);
    }, [proveedor]);

    if (!proveedor) return null;

    const handleChange = (e) => {

        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        await actualizarProveedor(datos);

        alert("Proveedor actualizado");

        recargar();

    };

    return (

        <div className="card shadow mb-4">

            <div className="card-header">
                Editar Proveedor
            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <label>Nombre</label>
                            <input
                                className="form-control"
                                name="nombreProveedor"
                                value={datos.nombreProveedor}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>NIT</label>
                            <input
                                className="form-control"
                                name="nit"
                                value={datos.nit}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Nombre Contacto</label>
                            <input
                                className="form-control"
                                name="nombreContacto"
                                value={datos.nombreContacto}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Celular</label>
                            <input
                                className="form-control"
                                name="nCelular"
                                value={datos.nCelular}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Email</label>
                            <input
                                className="form-control"
                                name="email"
                                value={datos.email}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <button
                        className="btn btn-primary"
                        type="submit"
                    >
                        Actualizar Cliente
                    </button>

                </form>

            </div>

        </div>

    );

}

export default ProveedorEdit;