import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';



const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
  console.log("Received admin login request with:", req.body); // Debug log
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      console.error("Query error:", err); // Debug log
      return res.json({ loginStatus: false, Error: "Query error" });
    }
    if (result.length > 0) {
      const email = result[0].email;
      const name = result[0].name;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id, name: name },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});
router.delete('/delete_category/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM category WHERE id = ?';
  con.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: 'Error deleting category' });
    }
    res.json({ Status: true, Result: 'Category deleted successfully' });
  });
});

router.get('/category', (req, res) => {
  const query = 'SELECT * FROM category';
  con.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: 'Error fetching categories' });
    }
    res.json({ Status: true, Result: results });
  });
});

router.get('/category/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM category WHERE id = ?';
  con.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: 'Error fetching category' });
    }
    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: 'Category not found' });
    }
    res.json({ Status: true, Result: result });
  });
});

router.post('/add_category', (req, res) => {
  const { name, salary, task1, task2, task3 } = req.body;  // Eliminamos common_tasks

  const query = 'INSERT INTO category (name, salary, task1, task2, task3) VALUES (?, ?, ?, ?, ?)';
  
  con.query(query, [name, salary, task1, task2, task3], (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: 'Error inserting category' });
    }
    res.json({ Status: true, Result: 'Category added successfully' });
  });
});

router.put('/edit_category/:id', (req, res) => {
  const { id } = req.params;
  const { name, salary, task1, task2, task3 } = req.body;  // Eliminamos common_tasks

  // Verificación de campos no vacíos
  if (!name || !salary) {
    return res.status(400).json({ Status: false, Error: "Todos los campos son obligatorios" });
  }

  const sql = `
   UPDATE category
   SET name = ?, salary = ?, task1 = ?, task2 = ?, task3 = ?
   WHERE id = ?
  `;

  con.query(sql, [name, salary, task1, task2, task3, id], (err, result) => {
    if (err) {
      console.error("Error al editar categoría:", err);
      return res.status(500).json({ Status: false, Error: "Error al editar la categoría" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Categoría no encontrada" });
    }

    return res.json({ Status: true, Message: "Categoría editada exitosamente" });
  });
});

// Insert employee route with additional logs
router.post('/add_employee', (req, res) => {
  console.log("Received request to add employee:", req.body); // Debug log
  const sql = `
    INSERT INTO employee (name, tel, email, address, category_id, salary, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      console.error("Bcrypt error:", err); // Debug log
      return res.json({ Status: false, Error: "Bcrypt error" });
    }
    const values = [
      req.body.name,
      req.body.tel, // Teléfono
      req.body.email,
      req.body.address,
      req.body.category_id, // Puesto
      req.body.salary,
      hash
    ];
    console.log("Inserting employee with values:", values); // Debug log
    con.query(sql, values, (err, result) => {
      if (err) {
        console.error("Query error during employee insert:", err); // Debug log
        return res.json({ Status: false, Error: err });
      }
      return res.json({ Status: true });
    });
  });
});

router.get('/employee', (req, res) => {
  const sql = `
    SELECT employee.*, category.name AS category_name 
    FROM employee 
    JOIN category ON employee.category_id = category.id
  `;
  console.log("Fetching all employees"); // Debug log
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Query error:", err); // Debug log
      return res.json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });
  });
});


router.get('/employee/:id', (req, res) => {
  const id = req.params.id;
  console.log("Fetching employee with ID:", id); // Debug log
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Query error:", err); // Debug log
      return res.json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.put('/edit_employee/:id', (req, res) => {
  const id = req.params.id;
  console.log("Editing employee with ID:", id, "with data:", req.body); // Debug log
  const sql = `
    UPDATE employee 
    SET name = ?, tel = ?, email = ?, address = ?, category_id = ?, salary = ? 
    WHERE id = ?
  `;
  const values = [
    req.body.name,
    req.body.tel, // Teléfono
    req.body.email,
    req.body.address,
    req.body.category_id, // Puesto
    req.body.salary
  ];

  con.query(sql, [...values, id], (err, result) => {
    if (err) {
      console.error("Query error during employee edit:", err); // Debug log
      return res.json({ Status: false, Error: "Query Error" + err });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/delete_employee/:id', (req, res) => {
  const id = req.params.id;
  console.log("Deleting employee with ID:", id); // Debug log
  const sql = "DELETE FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Query error during employee delete:", err); // Debug log
      return res.json({ Status: false, Error: "Query Error" + err });
    }
    return res.json({ Status: true, Result: result });
  });
});

// Additional routes for counts and logout
router.get('/admin_count', (req, res) => {
  const sql = "SELECT count(id) AS admin FROM admin";
  console.log("Counting admin records"); // Debug log
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Query error:", err); // Debug log
      return res.json({ Status: false, Error: "Query Error" + err });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.get('/employee_count', (req, res) => {
  const sql = "SELECT count(id) AS employee FROM employee";
  console.log("Counting employee records"); // Debug log
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Query error:", err); // Debug log
      return res.json({ Status: false, Error: "Query Error" + err });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.get('/salary_count', (req, res) => {
  const sql = "SELECT sum(salary) AS salaryOFEmp FROM employee";
  console.log("Summing salaries of employees"); // Debug log
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Query error:", err); // Debug log
      return res.json({ Status: false, Error: "Query Error" + err });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.get('/admin_records', (req, res) => {
  const sql = "SELECT * FROM admin";
  console.log("Fetching all admin records"); // Debug log
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Query error:", err); // Debug log
      return res.json({ Status: false, Error: "Query Error" + err });
    }
    return res.json({ Status: true, Result: result });
  });
});



// Ruta para agregar tareas
router.post('/add_task', (req, res) => {
  console.log("Received request to add task:", req.body); // Debug log

  // SQL para insertar una nueva tarea
  const sql = `
    INSERT INTO tasks (title, assignedTo, dueDate, priority, status, comments, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  // Valores a insertar
  const values = [
    req.body.title,        // Título de la tarea
    req.body.assignedTo,   // ID del empleado asignado (relación con la tabla employee)
    req.body.dueDate,      // Fecha de vencimiento
    req.body.priority,     // Prioridad (Low o High)
    req.body.status,       // Estado (Pending, In Progress, Completed)
    req.body.comments      // Comentarios
  ];

  // Ejecución de la consulta para insertar la tarea
  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("Query error during task insert:", err); // Debug log
      return res.json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Message: "Task added successfully" });
  });
});
// Ruta para obtener todas las tareas
router.get('/tasks', (req, res) => {
  const sql = "SELECT * FROM tasks";  // Consulta SQL para obtener todas las tareas
  console.log("Fetching all tasks");  // Debug log
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Query error:", err);  // Debug log
      return res.json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });  // Devolver las tareas
  });
});
router.get('/tasks/summary', (req, res) => {
  const sql = "SELECT id, title FROM tasks";  // Consulta SQL para obtener solo id y title
  console.log("Fetching task summary (id, title)");  // Debug log
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Query error:", err);  // Debug log
      return res.json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });  // Devolver solo id y title
  });
});


// backend: index.js o el archivo correspondiente
router.post('/execution_history', (req, res) => {
  const { taskId, taskName, executedCode, result, timestamp } = req.body;

  const sql = `
    INSERT INTO execution_history (task_id, task_name, executed_code, result, executed_at)
    VALUES (?, ?, ?, ?, ?)
  `;

  con.query(sql, [taskId, taskName, executedCode, result, timestamp], (err, result) => {
    if (err) {
      console.error("Error al insertar historial:", err);
      return res.status(500).json({ Status: false, Error: "Error al guardar el historial" });
    }
    return res.status(200).json({ Status: true, Message: "Historial guardado correctamente" });
  });
});

// Ruta para obtener una tarea por su ID
router.get('/task/:id', (req, res) => {
  const { id } = req.params;  // Obtener el ID de la URL
  const sql = 'SELECT * FROM tasks WHERE id = ?';  // Consulta SQL para obtener la tarea por su ID
  
  con.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: 'Error fetching task' });
    }
    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: 'Task not found' });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.get('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const sql = "SELECT * FROM tasks WHERE id = ?";
  
  con.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    if (result.length === 0) {
      return res.json({ Status: false, Error: "Task not found" });
    }
    return res.json({ Status: true, Result: result[0] });
  });
});
// Route to update a task by its ID
router.put('/task/:id', (req, res) => {
  const { id } = req.params; // Extract the task ID from the request parameters
  const { title, assignedTo, dueDate, priority, status, comments } = req.body; // Extract updated task data from the request body

  // Check if all required fields are provided
  if (!title || !assignedTo || !dueDate || !priority || !status) {
    return res.status(400).json({ Status: false, Error: "All fields are required" });
  }

  const sql = `
    UPDATE tasks 
    SET title = ?, assignedTo = ?, dueDate = ?, priority = ?, status = ?, comments = ?, updatedAt = NOW()
    WHERE id = ?
  `;

  // Update the task in the database
  con.query(sql, [title, assignedTo, dueDate, priority, status, comments, id], (err, result) => {
    if (err) {
      console.error("Error while updating task:", err);
      return res.status(500).json({ Status: false, Error: "Error updating task" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Task not found" });
    }

    return res.json({ Status: true, Message: "Task updated successfully" });
  });
});
// Ruta para eliminar una tarea y sus registros en execution_history
router.delete('/task/:id', (req, res) => {
  const { id } = req.params;  // Obtener el ID de la tarea a eliminar
  console.log("Deleting task and associated execution history with ID:", id); // Debug log

  // Eliminar los registros de execution_history relacionados
  const deleteHistorySQL = "DELETE FROM execution_history WHERE task_id = ?";
  con.query(deleteHistorySQL, [id], (err, historyResult) => {
    if (err) {
      console.error("Error deleting execution history records:", err); // Debug log
      return res.status(500).json({ Status: false, Error: "Error deleting execution history" });
    }

    // Después, eliminar la tarea en tasks
    const deleteTaskSQL = "DELETE FROM tasks WHERE id = ?";
    con.query(deleteTaskSQL, [id], (err, taskResult) => {
      if (err) {
        console.error("Query error during task delete:", err); // Debug log
        return res.status(500).json({ Status: false, Error: "Error deleting task" });
      }

      if (taskResult.affectedRows === 0) {
        return res.status(404).json({ Status: false, Error: "Task not found" });
      }

      return res.json({ Status: true, Message: "Task and associated history deleted successfully" });
    });
  });
});


router.post("/add_comment_to_log", (req, res) => {
  const { taskId, comment, adminName, employeeName } = req.body;
  const sql = `
    INSERT INTO task_log (task_id, comment, created_at, admin_name, employee_name)
    VALUES (?, ?, NOW(), ?, ?)
  `;
  con.query(sql, [taskId, comment, adminName || null, employeeName || null], (err, result) => {
    if (err) {
      return res.json({
        Status: false,
        Message: "Error al agregar comentario a la bitácora",
      });
    }
    return res.json({
      Status: true,
      Message: "Comentario agregado correctamente",
    });
  });
});


router.get("/task_log/:taskId", (req, res) => {
  const { taskId } = req.params;
  const sql = `
    SELECT id, comment, created_at, admin_name, employee_name
    FROM task_log
    WHERE task_id = ?
    ORDER BY created_at DESC
  `;
  con.query(sql, [taskId], (err, result) => {
    if (err) {
      return res.json({
        Status: false,
        Message: "Error al obtener los comentarios",
      });
    }
    return res.json({
      Status: true,
      taskLog: result,
    });
  });
});

// Ahora puedes usar db en tus rutas
router.get('/execution_history/:taskId', (req, res) => {
  const { taskId } = req.params;

  // Consulta para obtener el historial de ejecuciones de una tarea
  const query = 'SELECT id, task_id, task_name, executed_code, result, executed_at FROM execution_history WHERE task_id = ? ORDER BY executed_at DESC';

  con.query(query, [taskId], (err, results) => {
    if (err) {
      console.error('Error al obtener el historial de ejecuciones:', err);
      return res.status(500).json({ Status: false, Message: 'Error interno del servidor' });
    }

    res.json({
      Status: true,
      Result: results,
    });
  });
});

router.post('/add_admin', (req, res) => {
  const { email, name, password } = req.body;
  const query = 'INSERT INTO admin (email, name, password) VALUES (?, ?, ?)';
  con.query(query, [email, name, password], (err, result) => {
    if (err) {
      console.error(err);  // Para ver el error más detalladamente
      return res.status(500).json({ Status: false, Error: err.message });
    }
    return res.status(200).json({ Status: true, result });
  });
});
router.put('/update_admin/:id', (req, res) => {
  const { id } = req.params;
  const { email, name, password } = req.body;
  const query = 'UPDATE admin SET email = ?, name = ?, password = ? WHERE id = ?';
  con.query(query, [email, name, password, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

router.delete('/delete_admin/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM admin WHERE id = ?';
  con.query(query, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});




router.get('/logout', (req, res) => {
  console.log("Clearing authentication token (logout)"); // Debug log
  res.clearCookie('token');
  return res.json({ Status: true });
});



export { router as adminRouter };