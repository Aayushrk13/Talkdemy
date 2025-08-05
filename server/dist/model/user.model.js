"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const Userschema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["teacher", "student"]
    }
}, { timestamps: { createdAt: true, updatedAt: false } });
const User = (0, mongoose_1.model)("user", Userschema);
exports.User = User;
