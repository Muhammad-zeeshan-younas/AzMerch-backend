import express, { Request, Response } from "express";
import dashboardRoutes from "./routes/dashboard-routes";
const app = express();
const port = process.env.PORT || 3001;

app.use("/", dashboardRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
