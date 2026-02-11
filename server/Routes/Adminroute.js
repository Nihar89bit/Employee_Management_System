import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const router = express.Router();

/* =========================
   ADMIN AUTH MIDDLEWARE
========================= */
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      Status: false,
      message: "Not Authenticated",
    });
  }

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({
        Status: false,
        message: "Invalid Token",
      });
    }

    if (decoded.role !== "admin") {
      return res.status(403).json({
        Status: false,
        message: "Admin only",
      });
    }

    req.user = decoded;
    next();
  });
};

/* =========================
   ADMIN LOGIN (PUBLIC)
========================= */
router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" },
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // required for HTTPS (Render)
        sameSite: "None", // required for Vercel → Render
      });

      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});

/* =========================
   CATEGORY
========================= */
router.get("/category", verifyUser, (req, res) => {
  const sql = "SELECT * FROM category";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_category", verifyUser, (req, res) => {
  const sql = "INSERT INTO category (`name`) VALUES (?)";
  con.query(sql, [req.body.category], (err) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

/* =========================
   IMAGE UPLOAD
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname),
    );
  },
});
const upload = multer({ storage });

/* =========================
   EMPLOYEE CRUD
========================= */
router.post("/add_employee", verifyUser, upload.single("image"), (req, res) => {
  const sql = `INSERT INTO employee (name,email,password,salary,address,image,category_id) values(?)`;
  bcrypt.hash(String(req.body.password), 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: "Hashing Error" });
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.salary,
      req.body.address,
      req.file.filename,
      req.body.category_id,
    ];
    con.query(sql, [values], (err) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true });
    });
  });
});

router.get("/emp", verifyUser, (req, res) => {
  const sql = "SELECT * FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee/:id", verifyUser, (req, res) => {
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/editEmp/:id", verifyUser, (req, res) => {
  const sql = `
    UPDATE employee 
    SET name=?, email=?, salary=?, address=?, category_id=?
    WHERE id=?
  `;
  const values = [
    req.body.name,
    req.body.email,
    req.body.salary,
    req.body.address,
    req.body.category_id,
    req.params.id,
  ];
  con.query(sql, values, (err) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

router.delete("/delete_emp/:id", verifyUser, (req, res) => {
  const sql = "DELETE FROM employee WHERE id = ?";
  con.query(sql, [req.params.id], (err, result) => {
    if (err) return res.json({ Status: false });
    return res.json({ Status: true, Result: result });
  });
});

/* =========================
   DASHBOARD APIs
========================= */
router.get("/admin_count", verifyUser, (req, res) => {
  con.query("SELECT COUNT(id) AS admin FROM admin", (err, result) => {
    if (err) return res.json({ Status: false });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/emp_count", verifyUser, (req, res) => {
  con.query("SELECT COUNT(id) AS emp FROM employee", (err, result) => {
    if (err) return res.json({ Status: false });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/salary_count", verifyUser, (req, res) => {
  con.query(
    "SELECT SUM(salary) AS salaryOfEmp FROM employee",
    (err, result) => {
      if (err) return res.json({ Status: false });
      return res.json({ Status: true, Result: result });
    },
  );
});

router.get("/admin_records", verifyUser, (req, res) => {
  con.query("SELECT * FROM admin", (err, result) => {
    if (err) return res.json({ Status: false });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/attendance-summary", verifyUser, (req, res) => {
  const sql = `
    SELECT e.id AS employee_id, e.name, e.email,
    SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present_days,
    SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) AS absent_days,
    COUNT(a.id) AS total_records
    FROM employee e
    LEFT JOIN attendance a ON e.id = a.employee_id
    GROUP BY e.id, e.name, e.email
    ORDER BY e.name
  `;
  con.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

/* =========================
   LOGOUT
========================= */
router.get("/logout", (req, res) => {
  res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "None"
});
  return res.json({ Status: true });
});

export { router as adminRouter };
