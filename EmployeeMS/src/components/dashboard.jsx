import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiGrid,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import "./dash.css";
import axios from "axios";
import { apiUrl } from "../lib/api";

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  axios.defaults.withCredentials = true;

  const handlelogout = () => {
    axios.get(apiUrl("/auth/logout")).then((result) => {
      if (result.data.Status) {
        localStorage.removeItem("valid");
        navigate("/");
      }
    });
  };

  return (
    <div className="dashboard-layout">
      <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Link to="/dashboard" className="brand" onClick={() => setSidebarOpen(false)}>
          Admin
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/dashboard" onClick={() => setSidebarOpen(false)}>
              <FiHome className="icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/dashboard/emp" onClick={() => setSidebarOpen(false)}>
              <FiUsers className="icon" /> Manage Employees
            </Link>
          </li>
          <li>
            <Link to="/dashboard/category" onClick={() => setSidebarOpen(false)}>
              <FiGrid className="icon" /> Category
            </Link>
          </li>
          <li>
            <Link to="/dashboard/limo" onClick={() => setSidebarOpen(false)}>
              <FiUser className="icon" /> Limo
            </Link>
          </li>
          <li onClick={handlelogout}>
            <Link to="/" onClick={() => setSidebarOpen(false)}>
              <FiLogOut className="icon" /> Logout
            </Link>
          </li>
        </ul>
      </div>

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
