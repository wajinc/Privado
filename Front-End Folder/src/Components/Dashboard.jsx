import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios
    .get('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/logout', {
      withCredentials: true, // Enviar cookies si son necesarias
    })
    .then((result) => {
      if (result.data.Status) {
        localStorage.removeItem("valid"); // Limpia cualquier dato relevante del usuario
        navigate('/'); // Redirige al usuario a la página de inicio de sesión u otra ruta
      }
    })
    .catch((err) => {
      console.error("Error al cerrar sesión:", err);
    });
};

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark shadow-lg">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link to="/dashboard" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
              <span className="fs-4 fw-bold d-none d-sm-inline">Gestion Tareas Chimaltenango </span>
            </Link>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="w-100">
                <Link to="/dashboard" className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-house-door ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/employee" className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-person-lines-fill ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Empleados</span>
                </Link>
              </li>
              <li className="w-100">
  <Link to="/dashboard/task" className="nav-link px-0 align-middle text-white">
    <i className="fs-4 bi-check2-square ms-2"></i> {/* Cambiado 'fs-3' a 'fs-4' y 'me-2' a 'ms-2' */}
    <span className="ms-2 d-none d-sm-inline">Tareas</span>
  </Link>
</li>

              <li className="w-100">
                <Link to="/dashboard/category" className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-grid-1x2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Puestos</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/profile" className="nav-link px-0 align-middle text-white">
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

        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-between align-items-center bg-light shadow-sm">
            <h4>Administrador De proyectos</h4>
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          </div>
          <div className="p-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
