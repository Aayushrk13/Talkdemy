"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_js_1 = __importDefault(require("./routes/user.route.js"));
const index_js_1 = require("./db/index.js");
const auth_controller_js_1 = require("./controller/auth.controller.js");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config.js");
const app = (0, express_1.default)();
const port = process.env.PORT;
(0, index_js_1.connectDB)();
const cors_option = {
    origin: "http://localhost:5173",
    credentials: true
};
//for encoding url
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)(cors_option));
app.use((0, cookie_parser_1.default)());
app.use("/user", user_route_js_1.default);
app.get("/login", auth_controller_js_1.checkauth);
app.listen(port, () => {
    console.log(`Listeing on port :${port}`);
});
