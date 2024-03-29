"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};
const fileUpload = (0, multer_1.default)({
    limits: {
        fileSize: 6000000000000000,
    },
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/images");
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, (0, uuid_1.v1)() + "." + ext);
        },
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        const error = new Error("Invalid mime type!");
        if (!isValid) {
            cb(error);
        }
        else {
            cb(null, isValid);
        }
    },
});
exports.default = fileUpload;
