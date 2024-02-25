import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HttpError from "../error/http-error";

export const AuthenticateToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new HttpError("Authentication failed.", 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY || ""
    );

    // Attach the decoded user information to the request object
  } catch (err: any) {
    const error = new HttpError(
      err.message || "Authentication failed!",
      err.code || 401
    );
    return next(error);
  }
};
