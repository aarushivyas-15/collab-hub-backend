import express from "express";
import cors from "cors";

const app = express();

// basic configurations
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());

//cors  configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-type"],
  }),
);

//import router;
import { healthCheck } from "./controllers/healthcheck.controller.js";
app.use("/api/v1/healthcheck", healthCheck);

import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
app.use("/api/v1/auth", authRouter);
export default app;
