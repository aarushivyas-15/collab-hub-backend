import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controller.js";

const Router = Router();
router.route("/").get(healthCheck);

export default router;
