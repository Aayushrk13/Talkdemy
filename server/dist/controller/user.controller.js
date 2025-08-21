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
exports.register = register;
exports.loginByToken = loginByToken;
const user_model_js_1 = require("../model/user.model.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config.js");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
                } });
        }
        else {
            res.json({ message: "Error" });
        }
    });
}
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password, role } = req.body;
            console.log(req.body);
            const existinguser = yield user_model_js_1.User.findOne({ email: email });
            if (existinguser)
                return res.status(400).json({ success: false, message: "Email is already taken" });
            //create a user instance and register it in DB and check if the email is valid using OAuth
            const user = new user_model_js_1.User({
                name: name,
                email: email,
                password: password,
                role: role
            });
            yield user.save();
            res.status(201).json({ success: true, message: "User created successfully" });
        }
        catch (e) {
            console.log(e.message);
            res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function loginByToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        //for authentication and login without any 
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accesstoken;
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY || "fail");
            const user = yield user_model_js_1.User.findById(payload._id);
            if (user) {
                res.status(200).json({ success: true, user: {
                        "_id": user._id,
                        "name": user.name,
                        "email": user.email,
                        "role": user.role
                    } });
            }
        }
        catch (e) {
            console.log(e.message);
            res.status(401).json({ success: false });
        }
    });
}
