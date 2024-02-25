"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_controller_1 = __importDefault(require("../controller/user-controller"));
const fileUpload_1 = __importDefault(require("../middleware/fileUpload"));
const router = express_1.default.Router();
router.get("/session", user_controller_1.default.getUser);
router.post("/new-session", [
    (0, express_validator_1.check)("username").not().isEmpty(),
    (0, express_validator_1.check)("email").isEmail(),
    (0, express_validator_1.check)("password").isLength({ min: 6 }),
], user_controller_1.default.Signin);
router.delete("/delete-session", user_controller_1.default.Signout);
router.post("/registration", fileUpload_1.default.single("avatar"), user_controller_1.default.Signup);
exports.default = router;
