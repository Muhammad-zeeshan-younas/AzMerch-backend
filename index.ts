import express, { NextFunction, Request, Response } from "express";
import dashboardRoutes from "./routes/dashboard-routes";
import userRoutes from "./routes/user-routes";
import HttpError from "./error/http-error";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { AuthenticateToken } from "./middleware/authenticate";

const app = express();

const port = process.env.PORT || 3001;
const url = `mongodb+srv://muhammadzeeshanyounas777:p7tXnsuChMI6Lu5G@cluster0.nrs5ttn.mongodb.net/`;
const corsOptions = {
  origin: "http://localhost:3000", // or an array of allowed origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // enable credentials (cookies, authorization headers)
  optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
  exposedHeaders: ["Authorization"],
};

dotenv.config();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/api/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/user", userRoutes);
app.use("/", dashboardRoutes);

app.use((next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(`${url}`)
  .then(() => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
