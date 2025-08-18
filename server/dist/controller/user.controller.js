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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.signup = signup;
const user_model_js_1 = require("../model/user.model.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config.js");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req);
        console.log(req.body);
        const { email, password } = req.body;
        const user = yield user_model_js_1.User.findOne({ email: email, password: password });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ "_id": user._id }, process.env.JWT_SECRET_KEY || "fail");
            res.cookie("accesstoken", token, {
                httpOnly: true,
                secure: false
            });
            res.status(200).json({ success: true, user: {
                    "_id": user._id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role
                }, accesstoken: token });
        }
        else {
            res.json({ message: "Error" });
        }
    });
}
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password, role } = req.body;
        //create a user instance and register it in DB and check if the email is valid using OAuth
    });
}
