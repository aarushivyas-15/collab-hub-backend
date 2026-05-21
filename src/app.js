import express from "express";
import cors from "cors";
import { healthCheck } from "./controllers/healthcheck.controller.js";

import authRouter from "./routes/auth.route.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/project.routes.js";
import cookieParser from "cookie-parser";
import noteRouter from "./routes/note.route.js";

const app = express();

// basic configurations

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use("/api/v1/healthcheck", healthCheck);
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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/projects", taskRouter);

app.use("/api/v1/notes", noteRouter);
export default app;
