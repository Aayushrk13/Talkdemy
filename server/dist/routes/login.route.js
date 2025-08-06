"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_js_1 = require("../controller/user.controller.js");
const router = (0, express_1.default)();
router.post("/login", user_controller_js_1.login);
exports.default = router;
