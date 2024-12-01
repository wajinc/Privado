import React, { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeLogin = () => {
    const [values, setValues] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const isValid = localStorage.getItem("valid");
        if (isValid) {
            const employeeId = localStorage.getItem("employeeId");
            navigate(`/employee_detail/${employeeId}`);
        }
    }, [navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!values.email || !values.password) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        if (!termsAccepted) {
            setError("Debes aceptar los términos y condiciones para continuar.");
            return;
        }

        axios.post('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/employee/employee_login', values, { withCredentials: true })
        .then(result => {
                if (result.data.loginStatus) {
                    localStorage.setItem("valid", true);
                    localStorage.setItem("employeeId", result.data.id);

                    if (result.data.role === 'profileEmp') {
                        navigate(`/profileEmp/${result.data.id}`);
                    } else {
                        navigate(`/employee_detail/${result.data.id}`);
                    }
                } else {
                    setError(result.data.Error);
                }
            })
            .catch(err => {
                console.log(err);
                setError("Hubo un problema con el inicio de sesión.");
            });
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                {error && <div className='error-message'>{error}</div>}
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Correo:</strong></label>
                        <input
                            type="email"
                            name='email'
                            autoComplete='off'
                            placeholder='Ingrese correo'
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            className='form-control rounded-0'
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Contraseña:</strong></label>
                        <input
                            type="password"
                            name='password'
                            placeholder='Ingrese Contraseña'
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            className='form-control rounded-0'
                        />
                    </div>
                    <button className='btn btn-success w-100 rounded-0 mb-2'>Iniciar</button>
                    <div className='mb-1'>
                        <input
                            type="checkbox"
                            name="tick"
                            id="tick"
                            className='me-2'
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <label htmlFor="tick">Estás de acuerdo con los términos y condiciones.</label>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeLogin;
