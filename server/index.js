import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/Adminroute.js";
import { EmpRouter } from "./Routes/EmpRoutes.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import aiRoutes from "./Routes/AIRoutes.js";

const app = express();

// ✅ CORS FOR PRODUCTION + LOCAL
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://employee-management-system-rrd2.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static("Public"));


// ✅ VERIFY USER MIDDLEWARE
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      Status: false,
      Error: "Not Authenticated"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        Status: false,
        Error: "Invalid Token"
      });
    }

    req.id = decoded.email;
    req.role = decoded.role;
    next();
  });
};


// ROUTES
app.use("/auth", adminRouter);
app.use("/employee", EmpRouter);
app.use("/api/ai", verifyUser, aiRoutes);


// Optional verify check
app.get("/verify", verifyUser, (req, res) => {
  res.json({
    Status: true,
    id: req.id,
    role: req.role
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
