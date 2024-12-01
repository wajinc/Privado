import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const EmployeeDetail = () => {
  const { id: employeeId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
  });
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [logComments, setLogComments] = useState([]);
const [newComment, setNewComment] = useState("");
const [showLogModal, setShowLogModal] = useState(false);
const [selectedTaskId, setSelectedTaskId] = useState(null);

const handleFilterChange = (status) => {
  setFilter(status);
};
const filteredTasks = tasks.filter((task) => {
  if (filter === "All") return true;
  return task.status === filter;
});

  const handleLogout = () => {
    axios
      .get("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/employee/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        } else {
          console.error("Error en el logout:", result.data.Message);
        }
      })
      .catch((err) => console.error("Error al realizar logout:", err));
  };

  useEffect(() => {
    if (!employeeId) return;

    axios
      .get(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/employee/detail/${employeeId}`)
      .then((response) => {
        if (response.data.Status) {
          setEmployee(response.data.employee);
          setTasks(response.data.tasks);
          updateStats(response.data.tasks);
        } else {
          setError("No se pudieron cargar los datos del empleado o las tareas.");
        }
      })
      .catch((error) => {
        setError("Error al cargar los datos.");
        console.error(error);
      });
  }, [employeeId]);

  const updateStats = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "Completada").length;
    const inProgress = tasks.filter((task) => task.status === "Proceso").length;
    const pending = tasks.filter((task) => task.status === "Pendiente").length;

    setStats({ total, completed, inProgress, pending });
  };

  const handleTaskCompletion = (taskId) => {
    axios
      .post(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/employee/complete_task`, { taskId })
      .then((response) => {
        if (response.data.Status) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskId ? { ...task, status: "Completada" } : task
            )
          );
          updateStats(tasks);
        } else {
          console.error("Error al completar tarea:", response.data.Message);
        }
      })
      .catch((error) => console.error("Error al completar tarea:", error));
  };

  const handleTaskEdit = (task) => {
    setTaskToEdit(task);
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    axios
      .post(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/employee/update_task`, taskToEdit)
      .then((response) => {
        if (response.data.Status) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskToEdit.id ? { ...taskToEdit } : task
            )
          );
          setShowModal(false);
        } else {
          console.error("Error al actualizar tarea:", response.data.Message);
        }
      })
      .catch((error) => console.error("Error al guardar los cambios:", error));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  };
  const loadTaskLog = (taskId) => {
    axios
      .get(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/employee/task_log/${taskId}`)
      .then((response) => {
        if (response.data.Status) {
          setLogComments(response.data.taskLog);
        } else {
          console.error("Error al cargar la bitácora:", response.data.Message);
        }
      })
      .catch((err) => console.error("Error al obtener comentarios:", err));
  };
  const addCommentToLog = () => {
    const employeeName = employee?.name || ""; // Asumimos que tenemos el nombre del empleado
    axios
      .post("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/employee/add_comment_to_log", {
        taskId: selectedTaskId,
        comment: newComment,
        employeeName,
      })
      .then((response) => {
        if (response.data.Status) {
          loadTaskLog(selectedTaskId); // Recargar comentarios
          setNewComment(""); // Limpiar campo
          setShowLogModal(false); // Cerrar modal
        } else {
          console.error("Error al agregar comentario:", response.data.Message);
        }
      })
      .catch((error) => console.error("Error al agregar comentario:", error));
  };
    
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Menú Lateral */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark shadow-lg">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link to={`/employee_detail/${employeeId}`} className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
              <span className="fs-4 fw-bold d-none d-sm-inline">Gestión Tareas Chimaltenango</span>
            </Link>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <Link to={`/employee_detail/${employeeId}`} className="nav-link text-white px-0 align-middle">
                <i className="fs-4 bi-house-door ms-2"></i>
                <span className="ms-2 d-none d-sm-inline">Dashboard</span>
              </Link>
             
              <li className="w-100">
  {localStorage.getItem('employeeId') ? (
    <Link to={`/profileEmp/${localStorage.getItem('employeeId')}`} className="nav-link px-0 align-middle text-white">
      <i className="fs-4 bi-gear-fill ms-2"></i>
      <span className="ms-2 d-none d-sm-inline">Ejecutar</span>
    </Link>
  ) : (
    <span className="nav-link px-0 align-middle text-white">Empleado no autenticado</span>
  )}
</li>

              <li className="w-100">
              

              </li>
              <li className="w-100" onClick={handleLogout}>
                <Link className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-box-arrow-right ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contenido Central */}
<div className="col py-3">
  <div className="d-flex justify-content-between align-items-center mb-4">
    {employee && (
      <div>
        <h3 className="mb-0">Hola: {employee.name}</h3>
        <p className="mb-0">Correo: {employee.email}</p>
      </div>
    )}
    <button className="btn btn-outline-danger ms-auto" onClick={handleLogout}>
      Logout
    </button>
  </div>

  {error && <p className="text-danger">{error}</p>}



          {/* Estadísticas */}
          <div className="row text-center my-4">
  <div className="col-3">
    <div
      className="card shadow-sm border-primary"
      onClick={() => handleFilterChange("All")}
      style={{ cursor: "pointer" }}
    >
      <div className="card-body">
        <h5 className="card-title text-primary">Tareas Totales</h5>
        <p className="display-6">{stats.total}</p>
      </div>
    </div>
  </div>
  <div className="col-3">
    <div
      className="card shadow-sm border-success"
      onClick={() => handleFilterChange("Completada")}
      style={{ cursor: "pointer" }}
    >
      <div className="card-body">
        <h5 className="card-title text-success">Completadas</h5>
        <p className="display-6">{stats.completed}</p>
      </div>
    </div>
  </div>
  <div className="col-3">
    <div
      className="card shadow-sm border-warning"
      onClick={() => handleFilterChange("Proceso")}
      style={{ cursor: "pointer" }}
    >
      <div className="card-body">
        <h5 className="card-title text-warning">En Progreso</h5>
        <p className="display-6">{stats.inProgress}</p>
      </div>
    </div>
  </div>
  <div className="col-3">
    <div
      className="card shadow-sm border-danger"
      onClick={() => handleFilterChange("Pendiente")}
      style={{ cursor: "pointer" }}
    >
      <div className="card-body">
        <h5 className="card-title text-danger">Pendientes</h5>
        <p className="display-6">{stats.pending}</p>
      </div>
    </div>
  </div>
</div>


          {/* Tabla de Tareas */}
          {filteredTasks.length > 0 ? (
  <div className="table-responsive">
    <table className="table table-striped table-hover shadow-sm">
      <thead className="table-dark">
        <tr>
          <th>Tarea</th>
          <th>Prioridad</th>
          <th>Estado</th>
          <th>Vencimiento</th>
          <th>Comentario</th>
          <th>Creado</th>
          <th>Actualizado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {filteredTasks.map((task) => (
          <tr key={task.id}>
            <td>{task.title}</td>
            <td>{task.priority}</td>
            <td>{task.status}</td>
            <td>{formatDate(task.dueDate)}</td>
            <td>{task.comments}</td>
            <td>{formatDate(task.createdAt)}</td>
            <td>{formatDate(task.updatedAt)}</td>
            <td>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleTaskEdit(task)}
              >
                Actualizar
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setSelectedTaskId(task.id);
                  loadTaskLog(task.id);
                  setShowLogModal(true);
                }}
              >
                Ver Bitácora
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p>No hay tareas asignadas a este empleado.</p>
)}


          {/* Modal de Edición de Tarea */}
          {showModal && (
            <div className="modal fade show" style={{ display: "block" }} aria-labelledby="taskModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="taskModalLabel">Editar Tarea</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group mb-3">
                      <label htmlFor="taskTitle">Título</label>
                      <input
                        type="text"
                        id="taskTitle"
                        className="form-control"
                        value={taskToEdit?.title || ""}
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="taskComments">Comentarios</label>
                      <textarea
                        id="taskComments"
                        className="form-control"
                        rows="3"
                        value={taskToEdit?.comments || ""}
                        onChange={(e) => setTaskToEdit({ ...taskToEdit, comments: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="taskStatus">Estado</label>
                      <select
                        id="taskStatus"
                        className="form-control"
                        value={taskToEdit?.status || ""}
                        onChange={(e) => setTaskToEdit({ ...taskToEdit, status: e.target.value })}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Proceso">Proceso</option>
                        <option value="Completada">Completada</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancelar
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showLogModal && (
  <div className="modal fade show" style={{ display: "block" }} aria-labelledby="logModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="logModalLabel">Bitácora de Tarea</h5>
          <button type="button" className="btn-close" onClick={() => setShowLogModal(false)}></button>
        </div>
        <div className="modal-body">
          <textarea
            className="form-control"
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
          ></textarea>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={addCommentToLog}>Agregar Comentario</button>
          </div>
          <div className="mt-3">
          <h6>Comentarios</h6>
  {logComments.map((log) => (
    <div key={log.id} className="alert alert-secondary">
      <strong>{log.admin_name ? log.admin_name : log.employee_name}:</strong> {log.comment}
      <small className="d-block text-muted">{formatDate(log.created_at)}</small>
    </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
