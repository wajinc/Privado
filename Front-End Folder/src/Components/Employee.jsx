import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const handleDelete = (id) => {
    axios.delete('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/delete_employee/'+id)
    .then(result => {
        if(result.data.Status) {
            window.location.reload()
        } else {
            alert(result.data.Error)
        }
    })
  } 
  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>LISTA DE EMPLEADOS</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success">
        Agregar Empleado
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Telefono</th>
              <th>Correo</th>
              <th>Direccion </th>
              <th>Puesto </th>
              <th>Sueldo</th>
              <th>Opcion</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => (
              <tr>
                <td>{e.name}</td>
                <td>{e.tel}</td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{e.category_name}</td>
                <td>{e.salary}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_employee/` + e.id}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
