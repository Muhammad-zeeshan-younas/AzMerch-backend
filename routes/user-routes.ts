import express from "express";
import { check } from "express-validator";
import UserController from "../controller/user-controller";
import fileUpload from "../middleware/fileUpload";

const router = express.Router();

router.get("/session", UserController.getUser);

router.post(
  "/new-session",
  [
    check("username").not().isEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  UserController.Signin
);

router.delete("/delete-session", UserController.Signout);

router.post(
  "/registration",
  fileUpload.single("avatar"),
  UserController.Signup
);

export default router as express.Router;
