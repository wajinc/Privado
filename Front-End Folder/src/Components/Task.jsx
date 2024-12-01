import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newPriority, setNewPriority] = useState("");
  const [newStatus, setNewStatus] = useState(""); // Nuevo estado para gestionar el estado de la tarea
  const [showStatusModal, setShowStatusModal] = useState(false); // Modal para editar estado
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [logComments, setLogComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [executionHistory, setExecutionHistory] = useState([]);
  const [showExecutionHistoryModal, setShowExecutionHistoryModal] = useState(false);

  // Cargar empleados al montar el componente
  useEffect(() => {
    axios
      .get("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/employee")
      .then((response) => {
        if (response.data.Status) {
          setEmployees(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch((error) => console.error("Error al cargar empleados:", error));
  }, []);

  const handleOpenExecutionHistoryModal = (taskId) => {
    axios.get(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/execution_history/${taskId}`)
      .then((response) => {
        if (response.data.Status) {
          setExecutionHistory(response.data.Result);
          setShowExecutionHistoryModal(true);  // Correctly setting the state
        } else {
          alert(response.data.Message);
        }
      })
      .catch((error) => console.error("Error al cargar el historial de ejecuciones:", error));
  };
  

  // Cargar tareas al montar el componente
  useEffect(() => {
    axios
      .get("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/tasks")
      .then((result) => {
        if (result.data.Status) {
          setTasks(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Obtener el nombre del empleado por ID
  const getEmployeeNameById = (id) => {
    const employee = employees.find((emp) => emp.id === id);
    return employee ? employee.name : "Unassigned";
    
  };
  

  // Manejar eliminación de tareas
  const handleDelete = (id) => {
    axios
      .delete(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/task/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setTasks(tasks.filter((task) => task.id !== id));
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  // Abrir modal para editar prioridad
  const handleEditPriority = (task) => {
    setSelectedTask(task);
    setNewPriority(task.priority);
    setShowModal(true);
  };

  // Guardar cambios de prioridad
  const handleSavePriority = () => {
    if (selectedTask) {
      axios
        .put(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/task/${selectedTask.id}`, {
          ...selectedTask,
          priority: newPriority,
        })
        .then((result) => {
          if (result.data.Status) {
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.id === selectedTask.id
                  ? { ...task, priority: newPriority }
                  : task
              )
            );
            setShowModal(false);
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // Abrir modal para editar estado
  const handleEditStatus = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setShowStatusModal(true);
  };

  // Guardar cambios de estado
  const handleSaveStatus = () => {
    if (selectedTask) {
      axios
        .put(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/task/${selectedTask.id}`, {
          ...selectedTask,
          status: newStatus,
        })
        .then((result) => {
          if (result.data.Status) {
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.id === selectedTask.id
                  ? { ...task, status: newStatus }
                  : task
              )
            );
            setShowStatusModal(false);
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const handleOpenLogModal = (taskId) => {
    setSelectedTaskId(taskId);
    axios
      .get(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/task_log/${taskId}`)
      .then((response) => {
        if (response.data.Status) {
          setLogComments(response.data.taskLog);
          setShowLogModal(true);
        } else {
          alert(response.data.Message);
        }
      })
      .catch((error) => console.error("Error al cargar comentarios:", error));
  };
   // Agregar un comentario a la bitácora
   const handleAddCommentToLog = () => {
    const token = localStorage.getItem('token');  // Obtén el token desde el almacenamiento local
    let adminName = 'Admin';  // Valor por defecto en caso de que no haya token

    if (token) {
      const decodedToken = jwt.decode(token);  // Decodificar el token
      adminName = decodedToken ? decodedToken.name : 'Admin';  // Obtener el nombre del admin
    }

    axios
      .post("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/add_comment_to_log", {
        taskId: selectedTaskId,
        comment: newComment,
        adminName: adminName, // Cambiar a usuario autenticado si tienes un sistema de autenticación
      })
      .then((response) => {
        if (response.data.Status) {
          setLogComments([
            { id: Date.now(), comment: newComment, created_at: new Date(), admin_name: "Admin" },
            ...logComments,
          ]);
          setNewComment("");
        } else {
          alert(response.data.Message);
        }
      })
      .catch((error) => console.error("Error al agregar comentario:", error));
  };


  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>LISTADO DE TAREAS</h3>
      </div>
      <Link to="/dashboard/add_task" className="btn btn-success">
        Agregar Tarea
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Tarea</th>
              <th>Asignado a</th>
              <th>Fecha Maxima</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Comentarios</th>
              <th>Opcion</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{getEmployeeNameById(task.assignedTo)}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{task.priority}</span>
                    <button
                      className="btn btn-link ms-2"
                      onClick={() => handleEditPriority(task)}
                      style={{ marginLeft: "auto" }}
                    >
                      {task.priority === "Baja" ? "⚠️" : "🆘"}
                    </button>
                  </div>
                </td>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{task.status}</span>
                    <button
                      className="btn btn-link ms-2"
                      onClick={() => handleEditStatus(task)}
                      style={{ marginLeft: "auto" }}
                    >
                      {task.status === "Pendiente"
                        ? "⏳"
                        : task.status === "Proceso"
                        ? "🔄"
                        : "✅"}
                    </button>
                  </div>
                </td>
                <td>{task.comments}</td>
<td>
  {/* Botón de Editar */}
  <Link
    to={`/dashboard/edit_task/${task.id}`}
    className="btn btn-info btn-sm me-2"
  >
    <i className="bi bi-pencil"></i>
  </Link>

  {/* Botón de Eliminar */}
  <button
    className="btn btn-warning btn-sm"
    onClick={() => handleDelete(task.id)}
  >
    <i className="bi bi-trash"></i>
  </button>
</td>
<td>
  {/* Botón de Bitácora */}
  <button onClick={() => handleOpenLogModal(task.id)} className="btn btn-primary btn-sm">
    <i className="bi bi-clock"></i>
  </button>
</td>
<td>
  {/* Botón de Código */}
  <button
    className="btn btn-secondary btn-sm ms-2"
    onClick={() => handleOpenExecutionHistoryModal(task.id)}
  >
    <i className="bi bi-code"></i>
  </button>
</td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={showExecutionHistoryModal} onHide={() => setShowExecutionHistoryModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Historial de Ejecuciones de Código</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <ul>
      {executionHistory.map((execution, index) => (
        <li key={index}>
          <p><strong>Tarea:</strong> {execution.task_name}</p>
          <p><strong>Resultado:</strong> {execution.result}</p>
          <p><strong>Fecha de Ejecución:</strong> {new Date(execution.executed_at).toLocaleString()}</p>
          <p><strong>Código Ejecutado:</strong> <pre>{execution.executed_code}</pre></p>
        </li>
      ))}
    </ul>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowExecutionHistoryModal(false)}>
      Cerrar
    </Button>
  </Modal.Footer>
</Modal>

        {/* Modal para la bitácora */}
        <Modal show={showLogModal} onHide={() => setShowLogModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Bitácora de Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <ul className="list-group mb-3">
    {logComments.map((log) => (
      <li className="list-group-item" key={log.id}>
        <strong>
          {log.admin_name
            ? ` ${log.admin_name}`
            : ` ${log.employee_name}`}
        </strong>
        : {log.comment}
        <br />
        <small className="text-muted">
          {new Date(log.created_at).toLocaleString()}
        </small>
      </li>
    ))}
  </ul>
  <textarea
    className="form-control mb-3"
    rows="3"
    placeholder="Escribe un comentario..."
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
  ></textarea>
</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleAddCommentToLog}>
            Agregar Comentario
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar prioridad */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Prioridad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="priority" className="form-label">
            Nueva Prioridad
          </label>
          <select
            className="form-select"
            id="priority"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
          >
            <option value="Baja">Baja</option>
            <option value="Alta">Alta</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSavePriority}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar estado */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Estado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="status" className="form-label">
            Nuevo Estado
          </label>
          <select
            className="form-select"
            id="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Proceso">En progreso</option>
            <option value="Completo">Completada</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveStatus}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
  


    </div>
  );
};

export default Task;
