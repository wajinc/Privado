import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [category, setCategory] = useState({
    name: '',
    salary: '',
    task1: '',
    task2: '',
    task3: ''
  });
  const navigate = useNavigate();

  // Maneja el cambio de valores en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Función para agregar una nueva categoría
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/add_category', category)
      .then(result => {
        if (result.data.Status) {
          navigate('/dashboard/category'); // Redirige a la lista de categorías
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => {
        console.error('Error adding category:', err);
        alert('Error adding category. Please try again later.');
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white text-center">
              <h3>AGREGAR PUESTO DE TRABAJO</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre del puesto</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={category.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="salary" className="form-label">Sueldo: (Q)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="salary"
                    name="salary"
                    value={category.salary}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="task1" className="form-label">Tarea 1</label>
                  <input
                    type="text"
                    className="form-control"
                    id="task1"
                    name="task1"
                    value={category.task1}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="task2" className="form-label">Tarea 2</label>
                  <input
                    type="text"
                    className="form-control"
                    id="task2"
                    name="task2"
                    value={category.task2}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="task3" className="form-label">Tarea 3</label>
                  <input
                    type="text"
                    className="form-control"
                    id="task3"
                    name="task3"
                    value={category.task3}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success w-100 mt-3">Agregar Puesto</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
