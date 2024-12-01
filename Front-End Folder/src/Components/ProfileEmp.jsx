import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserHTML from "prettier/parser-html";
import parserCSS from "prettier/parser-postcss";

const ProfileEmp = () => {
  const { id } = useParams(); // Obtiene el 'id' de la URL
  const navigate = useNavigate(); // Usamos 'useNavigate' para redirigir al usuario
  const [employeeData, setEmployeeData] = useState(null);
  const [tasks, setTasks] = useState([]); // Inicializamos el estado para las tareas
  const [selectedTask, setSelectedTask] = useState(null);
  const [value, setValue] = useState("// Escribe tu código aquí");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([value]);
  const [currentIndex, setCurrentIndex] = useState(0);

  
   // Obtener las tareas del empleado al cargar el componente
   useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/employee/summary/${id}`);
        if (response.data.Status) {
          setTasks(response.data.tasks);
        } else {
          alert(response.data.message);
        }
      } catch (err) {
        console.error(err);
        alert("Error al obtener las tareas.");
      }
    };
    fetchTasks();
  }, [id]);


  

  const handleTaskSelection = (event) => {
    const taskId = event.target.value;
    const task = tasks.find((t) => t.id === parseInt(taskId));
    setSelectedTask(task);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleFormatCode = () => {
    try {
      let formattedCode = value;
      if (language === "javascript") {
        formattedCode = prettier.format(value, {
          parser: "babel",
          plugins: [parserBabel],
        });
      } else if (language === "html") {
        formattedCode = prettier.format(value, {
          parser: "html",
          plugins: [parserHTML],
        });
      } else if (language === "css") {
        formattedCode = prettier.format(value, {
          parser: "css",
          plugins: [parserCSS],
        });
      }
      setValue(formattedCode);
      const newHistory = [...history.slice(0, currentIndex + 1), formattedCode];
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
    } catch (error) {
      console.error("Error al formatear el código:", error);
    }
  };

  const handleExportCode = () => {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1; // Decrementamos el índice
      setCurrentIndex(newIndex);
      setValue(history[newIndex]); // Establecemos el valor en el historial correspondiente
    }
  };
  
  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1; // Incrementamos el índice
      setCurrentIndex(newIndex);
      setValue(history[newIndex]); // Establecemos el valor en el historial correspondiente
    }
  };
  
  const handleExecuteCode = async () => {
    if (language === "javascript") {
      try {
        const result = eval(value); // Be cautious with eval in production
        const outputMessage = result !== undefined ? String(result) : "Código ejecutado correctamente.";
        setOutput(outputMessage);

        // Save the result to the database
        if (selectedTask) {
          await axios.post("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/execution_history", {
            taskId: selectedTask.id,
            taskName: selectedTask.title,
            executedCode: value,
            result: outputMessage,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        const errorMessage = `Error: ${error.message}`;
        setOutput(errorMessage);

        // Save the error to the database
        if (selectedTask) {
          await axios.post("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/execution_history", {
            taskId: selectedTask.id,
            taskName: selectedTask.title,
            executedCode: value,
            result: errorMessage,
            timestamp: new Date().toISOString(),
          });
        }
      }
    } else {
      setOutput("La ejecución solo está disponible para código JavaScript.");
    }
  };

  const extensions = {
    javascript: [javascript()],
    html: [html()],
    css: [css()],
  };

  // Simulación de logout (borra la sesión)
  const handleLogout = () => {
    localStorage.removeItem("valid");
    localStorage.removeItem("employeeId");
    navigate('/');  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Menú Lateral */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark shadow-lg">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link to={`/employee_detail/${id}`} className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
              <span className="fs-4 fw-bold d-none d-sm-inline">Gestión Tareas Chimaltenango</span>
            </Link>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="w-100">
                <Link to={`/employee_detail/${id}`} className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-house-door ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to={`/profileEmp/${id}`} className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-gear-fill ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Ejecutar</span>
                </Link>
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



        <div className="col py-3">
  <div className="d-flex justify-content-end">
    <button className="btn btn-outline-danger" onClick={handleLogout}>
      Logout
    </button>
  </div>
  {/* Contenedor de selectores alineados horizontalmente */}
  <div className="d-flex align-items-center mb-3">
    {/* Selector de tarea */}
    <select onChange={handleTaskSelection} className="form-select me-3" style={{ width: "200px" }}>
      <option value="">Seleccionar tarea</option>
      {tasks.map((task) => (
        <option key={task.id} value={task.id}>
          {task.title}
        </option>
      ))}
    </select>

    {/* Selector de lenguaje */}
    <select
      onChange={handleLanguageChange}
      value={language}
      className="form-select"
      style={{ width: "200px" }}
    >
      <option value="javascript">JavaScript</option>
      <option value="html">HTML</option>
      <option value="css">CSS</option>
    </select>
  </div>

  {/* Editor de código y tareas */}
  <div style={{ padding: "20px" }}>
    {/* Editor de código */}
    <div style={{ height: "400px" }}>
      <CodeMirror
        value={value}
        height="100%"
        extensions={extensions[language]}
        onChange={(newValue) => setValue(newValue)}
      />
    </div>
    </div>

    {/* Botones de acciones */}
    <div className="mt-3">

      <button onClick={handleExecuteCode} className="btn btn-success me-2">Ejecutar</button>
      <button onClick={handleExportCode} className="btn btn-warning me-2">Exportar</button>
      <button onClick={handleUndo} className="btn btn-secondary me-2">Deshacer</button>
      <button onClick={handleRedo} className="btn btn-secondary">Rehacer</button>
    </div>

    {/* Salida del resultado */}
    <div className="mt-3">
      <h5>Resultado de la ejecución:</h5>
      <pre>{output}</pre>
    </div>
  </div>


      </div>
    </div>
  );
};

export default ProfileEmp;
