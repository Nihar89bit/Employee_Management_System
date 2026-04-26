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
const allowedOrigins = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!allowedOrigins.includes("http://localhost:5173")) {
  allowedOrigins.push("http://localhost:5173");
}

app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static("Public"));

const verifyUser = (req, res, next) => {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  const token = req.cookies.token || bearerToken;

  if (!token) {
    return res.status(401).json({
      Status: false,
      Error: "Not Authenticated",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
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

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", adminRouter);
app.use("/employee", EmpRouter);
app.use("/api/ai", verifyUser, aiRoutes);

app.get("/verify", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({
      Status: false,
      id: null,
      role: null,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({
        Status: false,
        id: null,
        role: null,
      });
    }

    res.json({
      Status: true,
      id: decoded.email,
      role: decoded.role,
    });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
