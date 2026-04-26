import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: false, message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

router.post("/employee_login", (req, res) => {
  const sql = "SELECT * FROM employee WHERE email = ?";

  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });

    if (result.length === 0) {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }

    bcrypt.compare(req.body.password, result[0].password, (compareErr, match) => {
      if (compareErr || !match) {
        return res.json({ loginStatus: false, Error: "Wrong email or password" });
      }

      const token = jwt.sign(
        { role: "employee", email: result[0].email, id: result[0].id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      return res.json({ loginStatus: true, id: result[0].id, token });
    });
  });
});

router.get("/detail/:id", (req, res) => {
  const sql = "SELECT * from employee where id = ?";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) return res.json({ Status: false });
    return res.json(result);
  });
});

router.get("/logout", (_req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

router.post("/apply", (req, res) => {
  const { start_date, end_date, reason } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    const sql =
      "INSERT INTO leaves (employee_id,start_date,end_date,reason) VALUES (?, ?, ?, ?)";

    con.query(sql, [user.id, start_date, end_date, reason], (queryErr) => {
      if (queryErr) return res.status(500).json({ error: "Database error" });
      res.json({ message: "Leave request Submitted successfully" });
    });
  });
});

router.get("/all-leaves", (_req, res) => {
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

router.put("/leave/:id/status", (req, res) => {
  const sql = "UPDATE leaves SET status = ? where id =?";
  con.query(sql, [req.body.status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Leaves updated successfully" });
  });
});

router.get("/my-leaves", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    const sql =
      "SELECT * FROM leaves WHERE employee_id = ? ORDER BY id DESC LIMIT 1";

    con.query(sql, [user.id], (queryErr, result) => {
      if (queryErr) return res.status(500).json({ error: "Database error" });

      if (result.length > 0) {
        return res.json({ status: true, leave: result[0] });
      }

      return res.json({ status: false, message: "No leaves found" });
    });
  });
});

router.post("/attendance/:type", verifyToken, (req, res) => {
  const { type } = req.params;
  const { employee_id } = req.body;
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().split(" ")[0];

  if (type === "checkin") {
    const checkSql = "SELECT * FROM attendance WHERE employee_id=? and date=?";
    con.query(checkSql, [employee_id, today], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      if (result.length > 0) {
        return res.json({ message: "Already checked-in today" });
      }

      const sql =
        "INSERT INTO attendance (employee_id,date,check_in,status) VALUES (?,?,?,?)";

      con.query(sql, [employee_id, today, currentTime, "Present"], (insertErr) => {
        if (insertErr) return res.status(500).json({ message: insertErr.message });
        res.json({ message: "Check-in successful" });
      });
    });
    return;
  }

  if (type === "checkout") {
    const sql =
      "UPDATE attendance set check_out=? where employee_id=? AND date=? AND check_out is NULL";

    con.query(sql, [currentTime, employee_id, today], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      if (result.affectedRows === 0) {
        return res.json({
          message: "Either not checked-in today or already checked-out",
        });
      }

      res.json({ message: "Check-out successful" });
    });
    return;
  }

  res
    .status(400)
    .json({ message: "Invalid attendance type (use checkin/checkout)" });
});

export { router as EmpRouter };
