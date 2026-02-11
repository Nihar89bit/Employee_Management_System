import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import multer from "multer";
import path from "path";
import { error } from "console";
import { decode } from "punycode";

const router = express.Router();

//middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // console.log("Authorization Header:", authHeader);
  if (!authHeader)
    return res.status(401).json({ status: false, message: "No token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err)
      return res.status(403).json({ status: false, message: "Invalid token" });
    req.user = decoded;
    next(); // go to next function
  });
};

router.post("/employee_login", (req, res) => {
  const sql = "SELECT * FROM employee WHERE email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err)
          return res.json({ loginStatus: false, Error: "Wrong Password" });
        if (response) {
          //genrate a token
          const email = result[0].email;
          const token = jwt.sign(
            { role: "employee", email: email, id: result[0].id },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );

          return res.json({ loginStatus: true, id: result[0].id, token });
        }
      });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});

router.get("/detail/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * from employee where id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false });
    return res.json(result);
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

router.post("/apply", (req, res) => {
  const { start_date, end_date, reason } = req.body;

  // ✅ Extract token directly from headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No  token provided" });

  jwt.verify(token, "jwt_secret_key", (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    const employee_id = user.id;

    const sql =
      "INSERT INTO leaves (employee_id,start_date,end_date,reason) VALUES (?, ?, ?, ?)";
    con.query(
      sql,
      [employee_id, start_date, end_date, reason],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Leave request Submitted successfully" });
      }
    );
  });
});

// ✅ Inside EmpRoutes.js
router.get("/all-leaves", (req, res) => {
  const sql = `
    SELECT l.id, l.start_date, l.end_date, l.reason, l.status, 
           e.name AS employee_name, e.email AS employee_email
    FROM leaves l 
    JOIN employee e ON l.employee_id = e.id
    ORDER BY l.id DESC
  `;
  con.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
});

//put is used for update something in db
router.put("/leave/:id/status", (req, res) => {
  const { status } = req.body;
  const sql = "UPDATE leaves SET status = ? where id =?";
  con.query(sql, [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Leaves updated successfully" });
  });
});

router.get("/my-leaves", (req, res) => {
  const authHeader = req.headers["authorization"]; //Example: "Bearer abc123xyz".split(" ") → ["Bearer", "abc123xyz"].

  const token = authHeader && authHeader.split(" ")[1]; //So basically, this line safely extracts the JWT token only, discarding the "Bearer" prefix.
  //[1] means take the second item → "abc123xyz" (the actual JWT token).
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, "jwt_secret_key", (err, user) => {
    if (err) return res.status(403).json({ error: "tnvalid token" });

    const sql =
      "SELECT * FROM leaves WHERE employee_id = ? ORDER BY id DESC LIMIT 1";
    con.query(sql, [user.id], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.length > 0) {
        return res.json({ status: true, leave: result[0] });
      } else {
        return res.json({ status: false, message: "No leaves found" });
      }
    });
  });
});

//Attendance marking

router.post("/attendance/:type", verifyToken, (req, res) => {
  const { type } = req.params;
  const { employee_id } = req.body;
  const now = new Date();
  const today = now.toISOString().split("T")[0]; // yyyy-mm-dd
  // Format time (hh:mm:ss)
  const currentTime = now.toTimeString().split(" ")[0];

  if (type === "checkin") {
    const checkSql = "SELECT * FROM attendance WHERE employee_id=? and date=?";
    con.query(checkSql, [employee_id, today], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      if (result.length > 0) {
        return res.json({ message: "⚠️ Already checked-in today" });
      }
      const sql =
        "INSERT INTO attendance (employee_id,date,check_in,status) VALUES (?,?,?,?)";
      con.query(sql, [employee_id, today, currentTime, "Present"], (err2) => {
        if (err2) return res.status(500).json({ message: err2.message });
        res.json({ message: "✅ Check-in successful" });
      });
    });
  } 
  else if (type === "checkout") {
    const sql =
      "UPDATE attendance set check_out=? where employee_id=? AND date=? AND check_out is NULL";
    con.query(sql, [currentTime, employee_id, today], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) {
        return res.json({
          message: "⚠️ Either not checked-in today or already checked-out",
        });
      }
      res.json({ message: "✅ Check-out successful" });
    });
  } else {
    res
      .status(400)
      .json({ message: "❌ Invalid attendance type (use checkin/checkout)" });
  }
});

export { router as EmpRouter };
