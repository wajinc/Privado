import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false); // Estado para evitar bucles

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const result = await axios.get(
          'http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/verify',
          { withCredentials: true }
        );

        if (result.data.Status && !isRedirecting) {
          setIsRedirecting(true); // Evita múltiples redirecciones

          if (result.data.role === "admin") {
            navigate('/dashboard');
          } else if (result.data.role === "employee") {
            navigate('/dashboard', { state: { role: "employee" } });
          }
        }
      } catch (err) {
        console.error("Error al verificar el usuario:", err);
      }
    };

    verifyUser();
  }, [navigate, isRedirecting]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-4 rounded shadow-lg w-50 loginForm">
        <h2 className="text-center mb-4">¡Bienvenido!</h2>
        <p className="text-center mb-4">
          <strong>Debes iniciar sesión para verificar tus tareas asignadas.</strong><br />
          Elige tu rol para continuar.
        </p>
        <div className="d-flex justify-content-around mt-4">
          <button
            type="button"
            className="btn btn-primary btn-lg w-40"
            onClick={() => { navigate('/employee_login'); }}
          >
            Empleado
          </button>
          <button
            type="button"
            className="btn btn-success btn-lg w-40"
            onClick={() => { navigate('/adminlogin'); }}
          >
            Administrador
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;
