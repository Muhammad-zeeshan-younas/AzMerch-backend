"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controller/user-controller"));
const router = express_1.default.Router();
router.post("/new-session", user_controller_1.default.Signin);
router.post("/registration", user_controller_1.default.Signup);
exports.default = router;
