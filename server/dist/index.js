"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_route_js_1 = __importDefault(require("./routes/login.route.js"));
const mongoose_1 = require("mongoose");
require("dotenv/config.js");
const app = (0, express_1.default)();
const port = process.env.PORT;
console.log(process.env.PORT);
(0, mongoose_1.connect)(process.env.DB_CONNECTION || "Fail")
    .then(() => {
    console.log("DB is connected");
}).catch((err) => {
    console.log(`some error: ${err}`);
});
//for encoding url
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/user", login_route_js_1.default);
app.listen(port, () => {
    console.log(`Listeing on port :${port}`);
});
