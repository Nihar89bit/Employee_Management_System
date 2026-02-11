import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Emp_detail() {
  const navigate = useNavigate();
  const [emp, setEmp] = useState([]);

  const handleLogout = () => {
    axios
      .get("https://employee-management-system-backend-rz80.onrender.com/employee/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };
  const { id } = useParams();
  useEffect(() => {
    axios
      .get("https://employee-management-system-backend-rz80.onrender.com/employee/detail/" + id)
      .then((result) => setEmp(result.data[0]))
      .catch((err) => console.log(err));
  }, [id]);
  
  const handleLeave = () => {
    navigate("/leave/" + id);
  };
  const [leaveStatus, setleaveStatus] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("https://employee-management-system-backend-rz80.onrender.com/employee/my-leaves", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status && res.data.leave.status !== "Pending") {
          setleaveStatus(res.data.leave.status);
          setShowPopup(true);

          // 🔔 Auto-hide after 10 sec
          setTimeout(() => {
            setShowPopup(false);
          }, 10000);
        }
      })
      .catch((err) => console.error("Error fetching leave status", err));
  }, []);

  const [attendanceMsg, setAttendanceMsg] = useState("");
  const markAttendance = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://employee-management-system-backend-rz80.onrender.com/employee/attendance/${type}`,
        { employee_id: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAttendanceMsg(res.data.message);
    } catch (err) {
      console.error("Attendance error:", err);
      setAttendanceMsg("Error marking attendance");
    }
  };
  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="container">
        {/* ✅ Popup goes here */}
        {showPopup && (
          <div
            className="alert alert-success alert-dismissible fade show text-center"
            role="alert"
          >
            🎉 Your leave has been {leaveStatus}
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowPopup(false)}
            ></button>
          </div>
        )}

        {/* ✅ Attendance Message */}
        {attendanceMsg && (
          <div className="alert alert-info text-center">{attendanceMsg}</div>
        )}

        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-10">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-gradient bg-primary text-white py-3 ">
                <h5 className="mb-0 text-center">Employee Details</h5>
              </div>
              <div className="card-body p-8">
                <div className="row mb-4">
                  <div className="col-12 text-center">
                    <div className="position-relative d-inline-block">
                      <img
                        src={
                          emp.photo ||
                          `https://employee-management-system-backend-rz80.onrender.com/Images/` + emp.image
                        }
                        alt={`${emp.name}'s photo`}
                        className="rounded-circle border border-3 border-primary shadow"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                      <span
                        className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                        style={{ width: "25px", height: "25px" }}
                      ></span>
                    </div>
                    <h5 className="mt-3 mb-1 text-primary ">
                      Employee ID: #{emp.id || "N/A"}
                    </h5>
                  </div>
                </div>

                <div className="row gap-3">
                  <div className="col-md-4 mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-15 rounded-circle p-2 me-3">
                        <i className="bi bi-person text-primary"></i>
                      </div>
                      <div>
                        <small className="text-muted text-uppercase fw-bold">
                          Name
                        </small>
                        <div className="fw-semibold">{emp.name}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-success bg-opacity-15 rounded-circle p-2 me-3">
                        <i className="bi bi-envelope text-success"></i>
                      </div>
                      <div>
                        <small className="text-muted text-uppercase fw-bold">
                          Email
                        </small>
                        <div className="fw-semibold">{emp.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-warning bg-opacity-15 rounded-circle p-2 me-3">
                        <i className="bi bi-currency-dollar text-warning"></i>
                      </div>
                      <div>
                        <small className="text-muted text-uppercase fw-bold">
                          Salary
                        </small>
                        <div className="fw-semibold">${emp.salary}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-light btn-sm me-2"
                      type="button"
                      style={{ backgroundColor: "#1187fc" }}
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-light btn-sm"
                      type="button"
                      style={{ backgroundColor: "#e30f0f" }}
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-1"></i>
                      Logout
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-outline-success btn-sm m-1 float-end mt-0  "
                  type="button"
                  onClick={handleLeave}
                >
                  Apply for leave
                </button>
                <button
                  className="btn btn-outline-primary btn-sm me-2 float-end "
                  type="button"
                  onClick={() => markAttendance("checkin")}
                  disabled={attendanceMsg.includes("Check-in")}
                >
                  Check-In
                </button>
                <button
                  className="btn btn-outline-warning btn-sm me-2 float-end"
                  type="button"
                  onClick={() => markAttendance("checkout")}
                  disabled={!attendanceMsg.includes("Check-in")}
                >
                  Check-Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Emp_detail;
