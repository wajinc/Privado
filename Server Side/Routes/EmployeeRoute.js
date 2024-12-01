import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'


const router = express.Router()

router.post("/employee_login", (req, res) => {
    const sql = "SELECT * from employee Where email = ?";
    con.query(sql, [req.body.email], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        bcrypt.compare(req.body.password, result[0].password, (err, response) => {
            if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });
            if(response) {
                const email = result[0].email;
                const token = jwt.sign(
                    { role: "employee", email: email, id: result[0].id },
                    "jwt_secret_key",
                    { expiresIn: "1d" }
                );
                res.cookie('token', token)
                return res.json({ loginStatus: true, id: result[0].id });
            }
        })
      } else {
          return res.json({ loginStatus: false, Error:"wrong email or password" });
      }
    });
});

// Employee detail route
router.get('/detail/:id', (req, res) => {
  const employeeId = req.params.id; // Employee ID from URL parameter
  const taskSql = "SELECT * FROM tasks WHERE assignedTo = ?";
  const employeeSql = "SELECT * FROM employee WHERE id = ?"; // New query to get employee details

  con.query(employeeSql, [employeeId], (err, employeeResult) => {
    if (err) return res.json({ Status: false, message: "Error al obtener la información del empleado." });

    if (employeeResult.length > 0) {
      const employeeDetails = employeeResult[0];

      // Fetch tasks assigned to the employee
      con.query(taskSql, [employeeId], (err, taskResult) => {
        if (err) return res.json({ Status: false, message: "Error al obtener las tareas." });

        return res.json({ 
          Status: true, 
          employee: employeeDetails,
          tasks: taskResult
        });
      });
    } else {
      return res.json({ Status: false, message: "Empleado no encontrado." });
    }
  });
});

// Ruta para actualizar una tarea
router.post('/update_task', (req, res) => {
  const { id, title, priority, comments, status } = req.body;

  const sql = "UPDATE tasks SET title = ?, priority = ?, comments = ?, status = ? WHERE id = ?";
  con.query(sql, [title, priority, comments, status, id], (err, result) => {
    if (err) return res.json({ Status: false, Message: "Error al actualizar la tarea" });

    if (result.affectedRows > 0) {
      return res.json({ Status: true, Message: "Tarea actualizada correctamente" });
    } else {
      return res.json({ Status: false, Message: "No se encontró la tarea" });
    }
  });
});

// Ruta para agregar comentario a la bitácora
router.post('/add_comment_to_log', (req, res) => {
  const { taskId, comment, employeeName, adminName } = req.body;

  // Si el comentario es de un empleado, solo insertamos employee_name
  // Si es de un administrador, insertamos admin_name
  const sql = "INSERT INTO task_log (task_id, comment, created_at, employee_name, admin_name) VALUES (?, ?, NOW(), ?, ?)";

  con.query(sql, [taskId, comment, employeeName, adminName || null], (err, result) => {
    if (err) return res.json({ Status: false, Message: "Error al agregar comentario a la bitácora" });

    return res.json({ Status: true, Message: "Comentario agregado a la bitácora correctamente" });
  });
});

// Ruta para obtener comentarios de la bitácora
router.get('/task_log/:taskId', (req, res) => {
  const { taskId } = req.params;
  const sql = "SELECT id, task_id, comment, created_at, employee_name, admin_name FROM task_log WHERE task_id = ? ORDER BY created_at DESC";

  con.query(sql, [taskId], (err, result) => {
    if (err) return res.json({ Status: false, Message: "Error al obtener los comentarios" });

    return res.json({ Status: true, taskLog: result });
  });
});


// Ruta para actualizar un comentario de la bitácora
router.post('/update_comment', (req, res) => {
  const { id, comment } = req.body;

  const sql = "UPDATE task_log SET comment = ? WHERE id = ?";
  con.query(sql, [comment, id], (err, result) => {
    if (err) return res.json({ Status: false, Message: "Error al actualizar el comentario" });

    return res.json({ Status: true, Message: "Comentario actualizado correctamente" });
  });
});

// Ruta para eliminar un comentario de la bitácora
router.delete('/delete_comment/:id', (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM task_log WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Message: "Error al eliminar el comentario" });

    return res.json({ Status: true, Message: "Comentario eliminado correctamente" });
  });
});

// Ruta para registrar el historial de ejecución
router.post('/execution_history', (req, res) => {
  const { taskId, taskName, executedCode, result, timestamp } = req.body;

  const sql = "INSERT INTO execution_history (task_id, task_name, executed_code, result, executed_at) VALUES (?, ?, ?, ?, ?)";
  con.query(sql, [taskId, taskName, executedCode, result, timestamp], (err, result) => {
      if (err) {
          console.error("Error al agregar historial de ejecución:", err);
          return res.json({ Status: false, Message: "Error al agregar historial de ejecución" });
      }

      return res.json({ Status: true, Message: "Historial de ejecución agregado correctamente" });
  });
});


router.get('/summary/:id', (req, res) => {
  const employeeId = req.params.id; // ID del empleado de los parámetros de la URL
  const taskSql = "SELECT id, title FROM tasks WHERE assignedTo = ?"; // Consulta solo los títulos

  // Consulta para obtener las tareas asignadas al empleado
  con.query(taskSql, [employeeId], (err, taskResult) => {
    if (err) {
      return res.json({ 
        Status: false, 
        message: "Error al obtener las tareas." 
      });
    }

    // Si hay tareas, retornarlas; si no, retornar un mensaje vacío
    if (taskResult.length > 0) {
      return res.json({ 
        Status: true, 
        tasks: taskResult 
      });
    } else {
      return res.json({ 
        Status: true, 
        message: "No se encontraron tareas asignadas.", 
        tasks: [] 
      });
    }
  });
});


router.get('/logout', (req, res) => {
    console.log("Clearing authentication token (logout)"); // Debug log
    res.clearCookie('token');
    return res.json({ Status: true });
});
  
export {router as EmployeeRouter}