import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Emp() {
  const [emp, setEmp] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("https://employee-management-system-backend-rz80.onrender.com/auth/emp")
      .then((result) => {
        if (result.data.Status) {
          setEmp(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const handleDlt = (id) => {
    axios
      .delete("https://employee-management-system-backend-rz80.onrender.com/auth/delete_emp/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="px-3 px-md-5 mt-4">
      <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-center mb-3">
        <h3 className="m-0 text-center text-md-start mx-auto">Employee list</h3>
        <Link
          to="/dashboard/add_employee"
          className="btn btn-success d-inline-flex align-items-center gap-2 shadow-sm"
        >
          <span className="bi bi-person-plus"></span>
          Add Employee
        </Link>
      </div>

      {/* Responsive wrapper for horizontal scroll on small screens */}
      <div className="table-responsive w-50 mx-auto rounded-3 shadow-sm  ">
        <table className="table table-striped table-hover table-bordered align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ minWidth: 160 }}>Name</th>
              <th style={{ width: 90 }}>Image</th>
              <th style={{ minWidth: 200 }}>Email</th>
              <th style={{ minWidth: 120 }}>Salary</th>
              <th style={{ minWidth: 200 }}>Address</th>
              <th style={{ width: 150 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {emp.length > 0 ? (
              emp.map((e, i) => {
                const name = e.name || e.Name || "—";
                const imgSrc = e.image
                  ? `https://employee-management-system-backend-rz80.onrender.com/Images/${e.image}`
                  : placeholder;

                return (
                  <tr key={e.id ?? i}>
                    <td className="fw-semibold">{name}</td>
                    <td>
                      <img
                        src={imgSrc}
                        alt={`${name} photo`}
                        className="employeeImg rounded-circle border"
                        onError={(ev) => (ev.currentTarget.src = placeholder)}
                      />
                    </td>
                    <td className="text-break">{e.email || "—"}</td>
                    <td>{e.salary ?? "—"}</td>
                    <td className="text-break">{e.address || "—"}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Link
                          to={`/dashboard/edit_emp/${e.id}`}
                          className="btn btn-info btn-sm text-white"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleDlt(e.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Emp;
