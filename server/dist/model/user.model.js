import { Schema, model } from "mongoose";
const Userschema = new Schema({
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
const User = model("user", Userschema);
export { User };
//# sourceMappingURL=user.model.js.map