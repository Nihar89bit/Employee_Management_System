import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/login";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Home from "./components/home";
import Emp from "./components/emp";
import Category from "./components/category";
import Addcategory from "./components/add_category";
import Addemployee from "./components/add_emp";
import EditEmployee from "./components/edit_emp";
import Start from "./components/start";
import Emplogin from "./components/employee_login";
import Emp_detail from "./components/employee_detail";
import PvtRoute from "./components/privateRoute";
import Leave from "./components/leave";
import ManageLeaves from "./components/manageLeaves";
import AIChat from "./components/limo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />}></Route>
        <Route path="/adminlogin" element={<Login />}></Route>
        <Route path="/employee_login" element={<Emplogin />}></Route>
        <Route path="/employee_detail/:id" element={<PvtRoute><Emp_detail /></PvtRoute>}> </Route>
        <Route
          path='/dashboard'element={ <PvtRoute> <Dashboard /></PvtRoute>}>
          <Route path="" element={<Home />}></Route>
          <Route path="/dashboard/emp" element={<Emp />}></Route>
          <Route path="/dashboard/category" element={<Category />}></Route>
          <Route path="/dashboard/limo" element={<AIChat />}></Route>
          <Route
            path="/dashboard/add_category"
            element={<Addcategory />}
          ></Route>
          <Route
            path="/dashboard/add_employee"
            element={<Addemployee />}
          ></Route>
          <Route
            path="/dashboard/edit_emp/:id"
            element={<EditEmployee />}
          ></Route>
        </Route>
         <Route path="/leave/:id" element={<Leave />}></Route>
         <Route path="/viewLeaves" element={<ManageLeaves />}></Route>
         
      </Routes>
    </BrowserRouter>
  );
}

export default App;
