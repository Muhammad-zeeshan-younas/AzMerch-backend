"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_error_1 = __importDefault(require("../error/http-error"));
const AuthenticateToken = (request, response, next) => {
    var _a;
    try {
        const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            throw new http_error_1.default("Authentication failed.", 401);
        }
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY || "");
    }
    catch (err) {
        const error = new http_error_1.default(err.message || "Authentication failed!", err.code || 401);
        return next(error);
    }
};
exports.AuthenticateToken = AuthenticateToken;
