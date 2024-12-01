import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        password: "",
        salary: "",
        address: "",
        category_id: "",
        tel: "", // Cambia esto a un campo de texto para una URL de imagen si es necesario
    });
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/category")
            .then((result) => {
                if (result.data.Status) {
                    setCategory(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Enviar los datos del empleado directamente
        axios
            .post("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/add_employee", employee)
            .then((result) => {
                if (result.data.Status) {
                    navigate("/dashboard/employee");
                } else {
                    alert(result.data.Error || "Error desconocido");
                }
            })
            .catch((err) => {
                console.error("Error en la solicitud", err);
                alert("Error al intentar agregar el empleado");
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <h3 className="text-center">AGREGAR EMPLEADO</h3>
                <form className="row g-1" onSubmit={handleSubmit}>
                    <div className="col-12">
                        <label htmlFor="inputName" className="form-label">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputName"
                            placeholder="Ingrese nombre y apelldo"
                            onChange={(e) =>
                                setEmployee({ ...employee, name: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12  ">
                        <label className="form-label" htmlFor="image">
                            Telefono:                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="tel"
                            placeholder="Ingrese numero de telefono"
                            onChange={(e) =>
                                setEmployee({ ...employee, tel: e.target.value })
                            }
                        />
                    </div>
                    
                    <div className="col-12">
                        <label htmlFor="inputEmail4" className="form-label">
                            Correo:
                        </label>
                        <input
                            type="email"
                            className="form-control rounded-0"
                            id="inputEmail4"
                            placeholder="Ingrese correo"
                            autoComplete="off"
                            onChange={(e) =>
                                setEmployee({ ...employee, email: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputPassword4" className="form-label">
                            Contraseña:
                        </label>
                        <input
                            type="password"
                            className="form-control rounded-0"
                            id="inputPassword4"
                            placeholder="Ingrese contrasena"
                            onChange={(e) =>
                                setEmployee({ ...employee, password: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputSalary" className="form-label">
                            Sueldo:
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputSalary"
                            placeholder="Ingrese sueldo"
                            autoComplete="off"
                            onChange={(e) =>
                                setEmployee({ ...employee, salary: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputAddress" className="form-label">
                            Direccion:
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputAddress"
                            placeholder="Ciudad, zona"
                            autoComplete="off"
                            onChange={(e) =>
                                setEmployee({ ...employee, address: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="category" className="form-label">
                            Puesto:
                        </label>
                        <select
                            name="category"
                            id="category"
                            className="form-select"
                            onChange={(e) =>
                                setEmployee({ ...employee, category_id: e.target.value })
                            }
                        >
                            {category.map((c) => {
                                return (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                  
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">
                          Agregar Empleado
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;
