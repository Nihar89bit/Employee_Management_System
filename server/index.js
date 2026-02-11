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

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static("Public"));


// ✅ AUTH MIDDLEWARE (NO EXTRA FILE)
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      Status: false,
      Error: "Not Authenticated"
    });
  }

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
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

// ✅ Protect AI route HERE
app.use("/api/ai", verifyUser, aiRoutes);


// Optional verify check
app.get("/verify", verifyUser, (req, res) => {
  res.json({
    Status: true,
    id: req.id,
    role: req.role
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
