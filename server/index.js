import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { adminRouter } from "./Routes/Adminroute.js";
import { EmpRouter } from "./Routes/EmpRoutes.js";
import aiRoutes from "./Routes/AIRoutes.js";

const app = express();

/* ===========================
   ✅ CORS CONFIGURATION
=========================== */

const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://employee-management-system-rrd2.vercel.app" // Your Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

/* ===========================
   ✅ MIDDLEWARES
=========================== */

app.use(express.json());
app.use(cookieParser());
app.use(express.static("Public"));

/* ===========================
   ✅ AUTH MIDDLEWARE
=========================== */

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      Status: false,
      Error: "Not Authenticated",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({
        Status: false,
        Error: "Invalid Token",
      });
    }

    req.id = decoded.email;
    req.role = decoded.role;
    next();
  });
};

/* ===========================
   ✅ ROUTES
=========================== */

app.use("/auth", adminRouter);
app.use("/employee", EmpRouter);

// Protected AI routes
app.use("/api/ai", verifyUser, aiRoutes);

// Optional verify check
app.get("/verify", verifyUser, (req, res) => {
  res.json({
    Status: true,
    id: req.id,
    role: req.role,
  });
});

/* ===========================
   ✅ SERVER START
=========================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
