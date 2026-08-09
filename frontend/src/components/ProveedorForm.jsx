import { useState } from "react";

import {
    guardarProveedor
} from "../services/proveedorService";

function ProveedorForm({ recargar }) {

    const [proveedor, setProveedor] = useState({
        nombreProveedor: "",
        nit: "",
        nombreContacto: "",
        nCelular: "",
        email: ""
    });

    const handleChange = (e) => {

        setProveedor({
            ...proveedor,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        await guardarProveedor(proveedor);

        alert("Proveedor registrado");

        recargar();

    };

    return (

        <div className="card shadow mb-4">

            <div className="card-header">
                Registrar Proveedor
            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <label>Nombre Empresa</label>
                            <input
                                className="form-control"
                                name="nombreProveedor"
                                value={proveedor.nombreProveedor}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>NIT</label>
                            <input
                                className="form-control"
                                name="nit"
                                value={proveedor.nit}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Nombre Contacto</label>
                            <input
                                className="form-control"
                                name="nombreContacto"
                                value={proveedor.nombreContacto}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Celular</label>
                            <input
                                className="form-control"
                                name="nCelular"
                                value={proveedor.nCelular}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={proveedor.email}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <button
                        className="btn btn-success"
                        type="submit"
                    >
                        Guardar Proveedor
                    </button>

                </form>

            </div>

        </div>

    );

}

export default ProveedorForm;