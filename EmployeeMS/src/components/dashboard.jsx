import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiGrid, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import "./dash.css";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  axios.defaults.withCredentials = true;
  
  const handlelogout = () => {
    axios.get("http://localhost:5000/auth/logout")
    .then(result => {
      if(result.data.Status){
        localStorage.removeItem("valid")
        navigate('/')
      }
    })
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Link to="/dashboard" className="brand" onClick={closeSidebar}>
          Admin
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/dashboard" onClick={closeSidebar}>
              <FiHome className="icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/dashboard/emp" onClick={closeSidebar}>
              <FiUsers className="icon" /> Manage Employees
            </Link>
          </li>
          <li>
            <Link to="/dashboard/category" onClick={closeSidebar}>
              <FiGrid className="icon" /> Category
            </Link>
          </li>
          <li>
            <Link to="/dashboard/limo" onClick={closeSidebar}>
              <FiUser className="icon" /> Limo
            </Link>
          </li>
          <li onClick={handlelogout}>
            <Link to="/" onClick={closeSidebar}>
              <FiLogOut className="icon" /> Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="content-header">
          <h4>Employee Management System</h4>
        </div>
        <div className="content-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;