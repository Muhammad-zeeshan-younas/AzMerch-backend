import express from "express";
import { check } from "express-validator";
import DashboardController from "../controller/dashboard-controller";
const router = express.Router();

router.get("/", DashboardController.getDashboard);

export default router as express.Router;
