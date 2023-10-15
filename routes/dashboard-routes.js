import express from "express";
import DashboardController from "../controller/dashboard-controller.mjs";
const router = express.Router();
router.get("/", DashboardController.getDashboard);
export default router;
