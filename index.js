"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard-routes"));
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const http_error_1 = __importDefault(require("./error/http-error"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const url = `mongodb+srv://muhammadzeeshanyounas777:p7tXnsuChMI6Lu5G@cluster0.nrs5ttn.mongodb.net/`;
const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    exposedHeaders: ["Authorization"],
};
dotenv_1.default.config();
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use("/api/uploads/images", express_1.default.static(path_1.default.join("uploads", "images")));
app.use("/api/user", user_routes_1.default);
app.use("/", dashboard_routes_1.default);
app.use((next) => {
    const error = new http_error_1.default("Could not find this route.", 404);
    throw error;
});
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});
mongoose_1.default
    .connect(`${url}`)
    .then(() => {
    app.listen(port);
})
    .catch((err) => {
    console.log(err);
});
