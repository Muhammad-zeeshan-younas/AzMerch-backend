import express, { Request, Response } from "express";

const getDashboard = (req: Request, res: Response) => {
  res.send("Hello, TypeScript with ES6 Imports!");
};

const DashboardController = {
  getDashboard,
};

export default DashboardController;
