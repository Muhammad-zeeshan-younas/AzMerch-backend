import express from "express";
import { check } from "express-validator";
import UserController from "../controller/user-controller";
import fileUpload from "../middleware/fileUpload";
const router = express.Router();

router.post(
  "/new-session",
  [
    check("username").not().isEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  fileUpload.single("avatar"),
  UserController.Signin
);
router.post("/registration", UserController.Signup);

export default router as express.Router;
