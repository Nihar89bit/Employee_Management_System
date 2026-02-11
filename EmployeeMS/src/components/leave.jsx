import React, { useState } from "react";
import axios from "axios";

function Leave() {
  const [isHovered, setIsHovered] = useState(false);

  const [start_date,setStartDate]=useState("");
  const [end_date,setEndDate]=useState("");
  const [reason,setReason]=useState("");
  const styles = {
    background: {
      background: "linear-gradient(to right, #e0eafc, #569dff)",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      background: "rgba(255, 255, 255, 0.85)",
      borderRadius: "12px",
      padding: "30px",
      boxShadow: isHovered
        ? "0 12px 24px rgba(0, 0, 0, 0.8)"
        : "0 8px 16px rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(8px)",
      width: "100%",
      maxWidth: "500px",
      transition: "box-shadow 0.3s ease",
    },
    heading: {
      textAlign: "center",
      color: "#198754",
      marginBottom: "20px",
    },
    label: {
      fontWeight: "500",
      marginBottom: "5px",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      marginBottom: "15px",
      resize: "none",
    },
    // button: {
    //   backgroundColor: '#198754',
    //   color: '#fff',
    //   padding: '10px 20px',
    //   border: 'none',
    //   borderRadius: '6px',
    //   cursor: 'pointer',
    //   float: 'right',
    // }
  };
  const handleLeave = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token"); // ✅ get JWT from localStorage
    // console.log("Token being sent:", token); 
    await axios.post(
      "https://employee-management-system-backend-rz80.onrender.com/employee/apply",
      {
        start_date,
        end_date,
        reason,
      },
      {
        headers: { Authorization: `Bearer ${token}` }, // ✅ attach token
      }
    );
    alert("Leave request submitted!");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div style={styles.background}>
      <div
        style={styles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h4 style={styles.heading}>Apply for Leave</h4>
        <form onSubmit={handleLeave}>
          <div>
            <label htmlFor="start_date" style={styles.label}>
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              style={styles.input}
              value={start_date}
              onChange={(e)=> setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="end_date" style={styles.label}>
              End Date
            </label>
            <input
              type="date"
              name="end_date"
              id="end_date"
              style={styles.input}
              value={end_date}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="reason" style={styles.label}>
              Reason
            </label>
            <textarea
              name="reason"
              id="reason"
              rows="4"
              placeholder="Reason for Leave..."
              style={styles.textarea}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-outline-success float-end">
            Apply Leave
          </button>
        </form>
      </div>
    </div>
  );
}

export default Leave;
