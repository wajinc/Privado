import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Pending");
  const [comments, setComments] = useState("");
  const [employees, setEmployees] = useState([]); // Estado para almacenar empleados
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar la lista de empleados al montar el componente
    axios
      .get("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/employee") // Asegúrate de que la URL sea correcta para obtener empleados
      .then((response) => {
        if (response.data.Status) {
          setEmployees(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch((error) => console.error("Error al cargar empleados:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      title,
      assignedTo,
      dueDate,
      priority,
      status,
      comments,
    };

    // Realizar la solicitud POST
    axios
      .post("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/add_task", newTask)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/task");
        } else {
          alert(result.data.Error || "Error al agregar la tarea");
        }
      })
      .catch((err) => {
        console.error("Error en la solicitud POST:", err);
        alert("Error al intentar agregar la tarea");
      });
  };

  return (
    <div className="container mt-2">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white text-center">
              <h3>AGREGAR TAREA</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label htmlFor="title" className="form-label">Tarea</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="assignedTo" className="form-label">Asignado a</label>
                  <select
                    className="form-select"
                    id="assignedTo"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar Empleado</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="dueDate" className="form-label">Fecha Maxima</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="priority" className="form-label">Prioridad</label>
                  <select
                    className="form-select"
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Baja">Baja</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="status" className="form-label">Estado</label>
                  <select
                    className="form-select"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Proceso">En Proceso</option>
                    <option value="Completo">Completada</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="comments" className="form-label">Comentario</label>
                  <textarea
                    className="form-control"
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows="3"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-success w-100">Agregar Tarea</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
