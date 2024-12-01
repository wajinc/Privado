import React, { useState, useEffect } from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserHTML from "prettier/parser-html";
import parserCSS from "prettier/parser-postcss";

function Profile() {
  const [value, setValue] = useState(
    localStorage.getItem("codeEditorValue") || "// Escribe tu código aquí"
  );
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([value]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tasks, setTasks] = useState([]); // Inicializamos el estado para las tareas
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("codeEditorValue", value);
  }, [value]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/tasks/summary", {
          withCredentials: true, // Habilita el envío de cookies si son necesarias
        });
        setTasks(response.data.Result); // Asume que el backend retorna las tareas en la clave 'Result'
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskSelection = (event) => {
    const taskId = event.target.value;
    const task = tasks.find((t) => t.id === parseInt(taskId));
    setSelectedTask(task);
  };

  const handleChange = (newValue) => {
    const newHistory = [...history.slice(0, currentIndex + 1), newValue];
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setValue(newValue);
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
      setCurrentIndex(currentIndex - 1);
      setValue(history[currentIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setValue(history[currentIndex + 1]);
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

  return (
    <div style={{ padding: "20px" }}>
      {/* Contenedor para los selectores en una sola fila */}
      <div className="d-flex align-items-center mb-3">
        {/* Selector de lenguaje */}
        <select
          onChange={handleLanguageChange}
          value={language}
          className="form-select mr-2" // Separa los elementos con margen
          style={{ width: "200px" }}
        >
          <option value="javascript">JavaScript</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>

        {/* Selector de tarea */}
        <select
          id="task"
          onChange={handleTaskSelection}
          className="form-select"
          style={{ width: "200px" }}
        >
          <option value="">Seleccionar tarea</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      {/* Botones de acciones */}
      <div className="d-flex mb-3">
        <button onClick={handleFormatCode} className="btn btn-outline-primary ml-2">
          <i className="bi bi-eraser"></i> Limpiar
        </button>
        <button onClick={handleExportCode} className="btn btn-outline-success ml-2">
          <i className="bi bi-download"></i> Exportar
        </button>
        <button onClick={handleUndo} disabled={currentIndex === 0} className="btn btn-outline-warning ml-2">
          <i className="bi bi-arrow-left-circle"></i> Deshacer
        </button>
        <button onClick={handleRedo} disabled={currentIndex === history.length - 1} className="btn btn-outline-info ml-2">
          <i className="bi bi-arrow-right-circle"></i> Rehacer
        </button>
        <button onClick={handleExecuteCode} className="btn btn-outline-danger ml-2">
          <i className="bi bi-play-circle"></i> Ejecutar
        </button>
      </div>

      {/* Tarea seleccionada */}
      {selectedTask && (
        <div>
          <h4>Tarea seleccionada: {selectedTask.title}</h4>
        </div>
      )}

      {/* Editor de código */}
      <div style={{ height: "400px" }}>
        <CodeMirror
          value={value}
          height="100%"
          extensions={extensions[language]}
          onChange={handleChange}
        />
      </div>

      {/* Resultado de la ejecución */}
      <div style={{ marginTop: "20px" }}>
        <h3>Salida:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default Profile;
