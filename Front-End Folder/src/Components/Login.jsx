import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
    axios.post('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/adminlogin', values, { withCredentials: true })
    .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem('valid', true);
          navigate('/dashboard');
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="loginPage">
      <div className="loginForm">
        {error && <div className="text-warning">{error}</div>}
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Ingrese correo"
            autoComplete="off"
            onChange={(e) =>
              setValues({ ...values, email: e.target.value })
            }
          />
          <input
            type="password"
            name="password"
            placeholder="Ingrese contraseña"
            onChange={(e) =>
              setValues({ ...values, password: e.target.value })
            }
          />
          <button type="submit">Iniciar</button>
          <div className='mb-1'> 
                    <input type="checkbox" name="tick" id="tick" className='me-2'/>
                    <label htmlFor="password">Estás de acuerdo con los términos y condiciones.</label>
                </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
