import express, { NextFunction, Request, Response } from "express";
import User from "../model/user";
import HttpError from "../error/http-error";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs/promises";
const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;

const getUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    return response.status(401).json({ error: "Token missing" });
  }
  try {
    const decoded = jwt.verify(token, secretKey || "dummy");
    // @ts-ignore
    response.status(200).json(decoded.user);
  } catch (error) {
    return response.status(401).json({ error: "Invalid token" });
  }
};

const Signin = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email = "", password: reqBodyPassword = "" } = request.body;

  try {
    const existingUser = await User.findOne({ email }).exec();

    if (!existingUser) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        401
      );
      return next(error);
    }

    const passwordMatch = await bcrypt.compare(
      reqBodyPassword,
      existingUser.password
    );

    if (!passwordMatch) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        401
      );
      return next(error);
    }

    const { password, ...userWithoutPassword } = existingUser.toObject({
      getters: true,
    });

    const token = jwt.sign(
      { user: userWithoutPassword },
      secretKey || "dummy",
      { expiresIn: "1h" }
    );

    response.setHeader("Authorization", `Bearer ${token}`);

    return response.json({ user: userWithoutPassword });
  } catch (error) {
    const errorResponse = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(errorResponse);
  }
};

const Signup = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email = "", password = "", username = "" } = request.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const errorResponse = new HttpError("Email already in use.", 422);
      return next(errorResponse);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    console.log(request.file);

    if (request.file) {
      newUser.avatar = request.file.path;
    }

    await newUser.save();

    response.status(201).json({ user: newUser.toObject({ getters: true }) });
  } catch (err) {
    const errorResponse = new HttpError(
      "Could not sign you up, please try again later",
      500
    );

    // Delete the uploaded file if it exists
    if (request.file && request.file.path) {
      try {
        await fs.unlink(request.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    return next(errorResponse);
  }
};

const Signout = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // Clear the token from the client-side
    response.setHeader("Authorization", "");

    // Respond with a success message
    return response.status(200).json({ message: "Signout successful" });
  } catch (error) {
    const errorResponse = new HttpError(
      "Signout failed, please try again later.",
      500
    );
    return next(errorResponse);
  }
};

const UserController = {
  Signin,
  Signup,
  getUser,
  Signout,
};

export default UserController;
