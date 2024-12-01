import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    axios.get('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/category')
      .then(result => {
        if (result.data.Status && Array.isArray(result.data.Result)) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error || 'Unexpected data format');
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        alert('Error fetching categories. Please try again later.');
      });
  }, []);

  // Función para eliminar una categoría
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      axios.delete(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/delete_category/${id}`)
        .then(result => {
          if (result.data.Status) {
            setCategory(category.filter(c => c.id !== id)); // Actualizar la lista
          } else {
            alert(result.data.Error);
          }
        })
        .catch(err => {
          console.error('Error deleting category:', err);
          alert('Error deleting category. Please try again later.');
        });
    }
  };

  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h3>LISTA DE PUESTOS</h3>
      </div>
      <Link to="/dashboard/add_category" className='btn btn-success'>Agregar Puesto</Link>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Nombre de Puesto</th>
              <th>Sueldo (Q)</th>
              <th>Funciones Principales</th>
              <th>Opcion</th>
            </tr>
          </thead>
          <tbody>
            {category.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.salary}</td>
                <td>
                  <ul>
                    <li>{c.task1}</li>
                    <li>{c.task2}</li>
                    <li>{c.task3}</li>
                  </ul>
                </td>
                <td>
  <Link to={`/dashboard/Edit_Category/${c.id}`} className='btn btn-warning btn-sm'>
    <i className="fs-6 bi-pencil ms-2"></i> {/* Ícono de editar */}
  </Link>
  <button onClick={() => handleDelete(c.id)} className='btn btn-danger btn-sm ml-2'>
    <i className="fs-6 bi-trash ms-2"></i> {/* Ícono de eliminar */}
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
