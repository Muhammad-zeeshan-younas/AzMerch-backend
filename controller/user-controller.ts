import express, { NextFunction, Request, Response } from "express";
import User from "../model/user";
import HttpError from "../error/http-error";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs/promises";

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

    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.ACCESS_TOKEN_SECRET_KEY || "",
      { expiresIn: "1h" }
    );

    response.setHeader("Authorization", `Bearer ${token}`);

    const { password, ...userWithoutPassword } = existingUser.toObject({
      getters: true,
    });
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

    // Check if an avatar file was uploaded
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

const UserController = {
  Signin,
  Signup,
};

export default UserController;
