import './App.css';


import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import Employee from './Components/Employee';
import Category from './Components/Category';
import EditCategory from './Components/EditCategory';
import Profile from './Components/Profile';
import ProfileEmp from './Components/ProfileEmp';  // Asegúrate de importar el componente correctamente


import AddCategory from './Components/AddCategory';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';
import Start from './Components/Start';
import EmployeeLogin from './Components/EmployeeLogin';
import EmployeeDetail from './Components/EmployeeDetail';
import PrivateRoute from './Components/PrivateRoute';
import Task from './Components/Task';
import AddTask from './Components/AddTask';
import EditTask from './Components/EditTask';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/adminlogin' element={<Login />} />
        <Route path='/employee_login' element={<EmployeeLogin />} />
        <Route path="/employee_detail/:id" element={<EmployeeDetail />} />
        <Route path="profileEmp/:id" element={<ProfileEmp />} /> {/* Ruta para ProfileEmp */}

        
        
        {/* Rutas privadas (requieren autorización) */}
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path='' element={<Home />} />
          <Route path='/dashboard/employee' element={<Employee />} />
          <Route path='/dashboard/category' element={<Category />} />
          <Route path='/dashboard/profile' element={<Profile />} />
          <Route path='/dashboard/add_category' element={<AddCategory />} />
          <Route path='/dashboard/Edit_category' element={<EditCategory />} />
          <Route path="/dashboard/Edit_Category/:id" element={<EditCategory />} />
          <Route path='/dashboard/add_employee' element={<AddEmployee />} />
          <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />} />
          <Route path='/dashboard/task' element={<Task />} />
          <Route path='/dashboard/add_task' element={<AddTask />} />
          <Route path='/dashboard/edit_task/:id' element={<EditTask />} /> {/* Cambié la URL de "EditTask" a "edit_task" */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

