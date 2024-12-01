import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState({
        name: "",
        tel: "", // Campo de teléfono
        email: "",
        address: "",
        category_id: "", // Puesto (categoría)
        salary: "", // Sueldo
    });
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener las categorías
        axios.get('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/category')
            .then(result => {
                if (result.data.Status) {
                    setCategory(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));

        // Obtener datos del empleado por ID
        axios.get('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/employee/' + id)
            .then(result => {
                setEmployee({
                    ...employee,
                    name: result.data.Result[0].name,
                    tel: result.data.Result[0].tel, // Cargar el valor de `tel`
                    email: result.data.Result[0].email,
                    address: result.data.Result[0].address,
                    category_id: result.data.Result[0].category_id,
                    salary: result.data.Result[0].salary,
                });
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/edit_employee/' + id, employee)
            .then(result => {
                if (result.data.Status) {
                    navigate('/dashboard/employee');
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <h3 className="text-center">EDITAR EMPLEADO</h3>
                <form className="row g-1" onSubmit={handleSubmit}>
                    <div className="col-12">
                        <label htmlFor="inputName" className="form-label">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputName"
                            placeholder="Ingrese nombre y apellido"
                            value={employee.name}
                            onChange={(e) =>
                                setEmployee({ ...employee, name: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="tel" className="form-label">
                            Teléfono:
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="tel"
                            placeholder="Ingrese número de teléfono"
                            value={employee.tel}
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
                            value={employee.email}
                            onChange={(e) =>
                                setEmployee({ ...employee, email: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputAddress" className="form-label">
                            Dirección:
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputAddress"
                            placeholder="Ingrese ciudad, zona"
                            autoComplete="off"
                            value={employee.address}
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
                            value={employee.category_id}
                            onChange={(e) =>
                                setEmployee({ ...employee, category_id: e.target.value })
                            }
                        >
                            {category.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputSalary" className="form-label">
                            Sueldo:
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputSalary"
                            placeholder="Ingrese monto"
                            autoComplete="off"
                            value={employee.salary}
                            onChange={(e) =>
                                setEmployee({ ...employee, salary: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">
                            Editar Empleado
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditEmployee;
