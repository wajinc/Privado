import express from "express";
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import { router as runTestsRouter } from './Routes/run-tests.js';  // Importa la nueva ruta
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express(); 

// Middleware para CORS

app.use(cors({
    origin: [
        'http://ec2-3-227-125-153.compute-1.amazonaws.com:5173', // Dirección de tu frontend en EC2
        'http://192.168.1.66:5173' // Dirección de tu frontend en red local (si es necesario)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Si necesitas enviar cookies o tokens
}));



// Middleware para manejar JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Rutas de autenticación y empleados
app.use('/auth', adminRouter);




app.use('/employee', EmployeeRouter);


// Ruta para ejecutar pruebas
app.use(runTestsRouter);  // Usar la ruta para ejecutar pruebas

app.use(express.static('Public'));

// Verificación de usuario
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
            if (err) return res.json({ Status: false, Error: "Wrong Token" });
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.json({ Status: false, Error: "Not authenticated" });
    }
};

// Ruta de verificación de usuario
app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});
// Ruta para obtener las tareas


app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor corriendo en el puerto 3000');
});

