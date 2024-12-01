import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setemployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });
  

  useEffect(() => {
    adminCount();
    employeeCount();
    salaryCount();
    AdminRecords();
  }, []);

  const AdminRecords = () => {
    axios.get('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/admin_records')
      .then(result => {
        if (result.data.Status) {
          setAdmins(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      });
  };

  const adminCount = () => {
    axios.get('http://localhost:3000/auth/admin_count')
      .then(result => {
        if (result.data.Status) {
          setAdminTotal(result.data.Result[0].admin);
        }
      });
  };

  const employeeCount = () => {
    axios.get('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/employee_count')
      .then(result => {
        if (result.data.Status) {
          setemployeeTotal(result.data.Result[0].employee);
        }
      });
  };

  const salaryCount = () => {
    axios.get('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/salary_count')
      .then(result => {
        if (result.data.Status) {
          setSalaryTotal(result.data.Result[0].salaryOFEmp);
        } else {
          alert(result.data.Error);
        }
      });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios.post('http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/add_admin', formData)
      .then((response) => {
        if (response.data.Status) {
          alert('Administrador agregado exitosamente');
          setShowAddModal(false);
          AdminRecords();
        } else {
          alert(response.data.Error);
        }
      });
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setFormData(admin); // Prefill form with selected admin's data
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/update_admin/${selectedAdmin.id}`, formData)
      .then((response) => {
        if (response.data.Status) {
          alert('Administrador actualizado');
          setShowEditModal(false);
          AdminRecords();
        } else {
          alert(response.data.Error);
        }
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este administrador?')) {
      axios.delete(`http://ec2-3-227-125-153.compute-1.amazonaws.com:3000/auth/delete_admin/${id}`)
        .then((response) => {
          if (response.data.Status) {
            alert('Administrador eliminado');
            AdminRecords();
          } else {
            alert(response.data.Error);
          }
        });
    }
  };

  return (
    <div>
      {/* Estadísticas */}
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <h4 className='text-center'>Admin</h4>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <h4 className='text-center'>Empleados</h4>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <h4 className='text-center'>Sueldos</h4>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>Q{salaryTotal}</h5>
          </div>
        </div>
      </div>

      {/* Botón para agregar administrador */}
      <div className='mt-4 px-5'>
        <button className="btn btn-primary mb-3" onClick={() => setShowAddModal(true)}>
          Agregar Admin
        </button>
      </div>

      {/* Tabla de administradores */}
      <div className='mt-4 px-5 pt-3'>
        <h3>Listado de Administradores</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nombre</th>
              <th>Opción</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id}>
                <td>{a.email}</td>
                <td>{a.name}</td>
                <td>
                  <button className="btn btn-info btn-sm me-2" onClick={() => handleEdit(a)}>
                    Editar
                  </button>
                  <button className="btn btn-warning btn-sm" onClick={() => handleDelete(a.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar o editar */}
      {(showAddModal || showEditModal) && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <h5>{showAddModal ? 'Agregar Admin' : 'Editar Admin'}</h5>
            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit}>
              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Nombre:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Contraseña:</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success me-2">Guardar</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyles = {
  background: 'white',
  padding: '20px',
  borderRadius: '5px',
  width: '400px',
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
};

export default Home;
