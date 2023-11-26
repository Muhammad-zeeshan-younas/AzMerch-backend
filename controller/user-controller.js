"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../model/user"));
const http_error_1 = __importDefault(require("../error/http-error"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const promises_1 = __importDefault(require("fs/promises"));
const Signin = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email = "", password: reqBodyPassword = "" } = request.body;
    try {
        const existingUser = yield user_1.default.findOne({ email }).exec();
        if (!existingUser) {
            const error = new http_error_1.default("Invalid credentials, could not log you in.", 401);
            return next(error);
        }
        const passwordMatch = yield bcrypt_1.default.compare(reqBodyPassword, existingUser.password);
        if (!passwordMatch) {
            const error = new http_error_1.default("Invalid credentials, could not log you in.", 401);
            return next(error);
        }
        const token = jsonwebtoken_1.default.sign({ userId: existingUser.id, email: existingUser.email }, process.env.ACCESS_TOKEN_SECRET_KEY || "", { expiresIn: "1h" });
        response.setHeader("Authorization", `Bearer ${token}`);
        const _a = existingUser.toObject({
            getters: true,
        }), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
        return response.json({ user: userWithoutPassword });
    }
    catch (error) {
        const errorResponse = new http_error_1.default("Logging in failed, please try again later.", 500);
        return next(errorResponse);
    }
});
const Signup = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email = "", password = "", username = "" } = request.body;
    try {
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            const errorResponse = new http_error_1.default("Email already in use.", 422);
            return next(errorResponse);
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new user_1.default({
            username,
            email,
            password: hashedPassword,
        });
        // Check if an avatar file was uploaded
        if (request.file) {
            newUser.avatar = request.file.path;
        }
        yield newUser.save();
        response.status(201).json({ user: newUser.toObject({ getters: true }) });
    }
    catch (err) {
        const errorResponse = new http_error_1.default("Could not sign you up, please try again later", 500);
        // Delete the uploaded file if it exists
        if (request.file && request.file.path) {
            try {
                yield promises_1.default.unlink(request.file.path);
            }
            catch (unlinkError) {
                console.error("Error deleting file:", unlinkError);
            }
        }
        return next(errorResponse);
    }
});
const UserController = {
    Signin,
    Signup,
};
exports.default = UserController;
