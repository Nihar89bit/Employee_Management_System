import React, { useEffect, useState } from "react";
import axios from "axios";
import "./mngLeave.css";

function ManageLeaves() {
  const [leaves, setleaves] = useState([]);

  const fetchleaves = async () => {
    try {
      const result = await axios.get(
        "http://localhost:5000/employee/all-leaves"
      );
      setleaves(result.data);
    } catch (err) {
      console.log("Error fetching leaves : ", err);
    }
  };
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/employee/leave/${id}/status`, {
        status,
      });
      fetchleaves(); //refresh after update
    } catch (err) {
      console.log("Error Updating status : ", err);
    }
  };

  useEffect(() => {
    fetchleaves();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Manage Employee Leaves</h3>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Email</th>
            <th>Start</th>
            <th>End</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length > 0 ? (
            leaves.map((leave) => (
              <tr key={leave.id}>
                <td data-label="ID">{leave.id}</td>
                {/* The data-label attribute is what makes the responsive table work properly on small screens. */}
                <td data-label="Employee">{leave.employee_name}</td>
                <td data-label="Email">{leave.employee_email}</td>
                <td data-label="Start">{leave.start_date}</td>
                <td data-label="End">{leave.end_date}</td>
                <td data-label="Reason">{leave.reason}</td>
                <td data-label="Status">
                  <span
                    className={`badge ${
                      leave.status === "Approved"
                        ? "bg-success"
                        : leave.status === "Rejected"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td data-label="Action">
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => updateStatus(leave.id, "Approved")}
                    disabled={leave.status === "Approved"}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => updateStatus(leave.id, "Rejected")}
                    disabled={leave.status === "Rejected"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageLeaves;
