import React, { useEffect, useState } from "react";
import "./hm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [adminTotal, setAdminTotal] = useState();
  const [empTotal, setEmpTotal] = useState();
  const [salaryTotal, setSalaryTotal] = useState();
  const [admins, setAdmins] = useState();
  const [attendanceSummary, setAttendanceSummary] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    adminCount();
    empCount();
    salaryCount();
    AdminRecords();
    AttendanceSummary();
  }, []);

  const AdminRecords = () => {
    axios.get("https://employee-management-system-backend-rz80.onrender.com/auth/admin_records").then((result) => {
      if (result.data.Status) {
        setAdmins(result.data.Result);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const adminCount = () => {
    axios.get("https://employee-management-system-backend-rz80.onrender.com/auth/admin_count").then((result) => {
      if (result.data.Status) {
        setAdminTotal(result.data.Result[0].admin);
      }
    });
  };
  const empCount = () => {
    axios.get("https://employee-management-system-backend-rz80.onrender.com/auth/emp_count").then((result) => {
      if (result.data.Status) {
        setEmpTotal(result.data.Result[0].emp);
      }
    });
  };
  const salaryCount = () => {
    axios.get("https://employee-management-system-backend-rz80.onrender.com/auth/salary_count").then((result) => {
      if (result.data.Status) {
        setSalaryTotal(result.data.Result[0].salaryOfEmp);
      }
    });
  };

  const handleLeave = () => {
    navigate("/viewLeaves");
  };

  const AttendanceSummary = () => {
    axios
      .get("https://employee-management-system-backend-rz80.onrender.com/auth/attendance-summary")
      .then((res) => setAttendanceSummary(res.data))
      .catch((err) => console.log("Error fetching in attendance summary", err));
  };

  return (
    <div className="dashboard-container ">
      {/* Header Section */}
      <div className="header-section">
        <h1 className="main-title ">Employee Management System</h1>
        <p className="subtitle">Dashboard overview of your organization</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Admin Card */}
        <div className="stats-card">
          <h3 className="card-title">Admin</h3>
          <div className="stat-display">
            <span className="stat-label">Total:</span>
            <span className="stat-number admin-number">{adminTotal}</span>
          </div>
        </div>

        {/* Employee Card */}
        <div className="stats-card">
          <h3 className="card-title">Employee</h3>
          <div className="stat-display">
            <span className="stat-label">Total:</span>
            <span className="stat-number employee-number">{empTotal}</span>
          </div>
        </div>

        {/* Salary Card */}
        <div className="stats-card">
          <h3 className="card-title">Salary</h3>
          <div className="stat-display">
            <span className="stat-label">Total:</span>
            <span className="stat-number salary-number">{salaryTotal}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 px-5 pt-3 d-grid justify-content-center">
        <h3>List of Admins</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(admins) &&
              admins.map((a, index) => (
                <tr key={index}>
                  <td>{a.email}</td>
                  {/* <td>
                    <button className="btn btn-info btn-sm text-white">
                      Edit
                    </button>
                    <button className="btn btn-warning btn-sm">Delete</button>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="attendance-card">
        <h3>Attendance Summary</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Present Days</th>
                <th>Absent Days</th>
                <th>Total Records</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(attendanceSummary) &&
                attendanceSummary.map((s, index) => (
                  <tr key={s.employee_id}>
                    <td>{index + 1}</td>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.present_days}</td>
                    <td>{s.absent_days}</td>
                    <td>{s.total_records}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-4 d-grid justify-content-end">
        <button
          className="btn btn-outline-light btn-sm"
          type="button"
          style={{ backgroundColor: "#e30f0f" }}
          onClick={handleLeave}
        >
          View all leaves
        </button>
      </div>
    </div>
  );
}

export default Home;
