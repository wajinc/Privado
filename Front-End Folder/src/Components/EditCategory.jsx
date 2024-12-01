import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditCategory = () => {
  const [category, setCategory] = useState({
    name: '',
    salary: '',
    task1: '',
    task2: '',
    task3: ''
  });
  const [loading, setLoading] = useState(true); // Estado de carga
  const { id } = useParams(); // Obtiene el ID de la categoría de la URL
  const navigate = useNavigate();

  // Recuperar los datos de la categoría cuando el componente se monta
  useEffect(() => {
    // Llamada a la API para obtener la categoría por su ID
    axios.get(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/category/${id}`)
      .then(result => {
        if (result.data.Status) {
          setCategory({
            name: result.data.Result[0].name,
            salary: result.data.Result[0].salary,
            task1: result.data.Result[0].task1,
            task2: result.data.Result[0].task2,
            task3: result.data.Result[0].task3
          });
          setLoading(false); // Datos cargados, cambia el estado de carga
        } else {
          alert('Category not found');
          setLoading(false); // Cambiar el estado incluso si no se encuentra
        }
      })
      .catch(err => {
        console.error('Error fetching category:', err);
        alert('Error fetching category. Please try again later.');
        setLoading(false); // Cambiar el estado incluso si hay error
      });
  }, [id]);

  // Maneja el cambio de valores en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Función para actualizar la categoría
  const handleSubmit = (e) => {
    e.preventDefault();
    // Llamada a la API para actualizar la categoría
    axios.put(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/edit_category/${id}`, category)
      .then(result => {
        if (result.data.Status) {
          navigate('/dashboard/category'); // Redirige a la lista de categorías
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => {
        console.error('Error editing category:', err);
        alert('Error editing category. Please try again later.');
      });
  };

  // Si los datos aún están cargando, muestra un mensaje de carga
  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white text-center">
              <h3>EDITAR PUESTO DE TRABAJO</h3>
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
                <button type="submit" className="btn btn-primary w-100 mt-3">Actualizar Puesto</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
