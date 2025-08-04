import { User } from "../model/user.model.js";
export async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, password: password });
    if (user) {
        console.log("user is found");
        res.status(200).json({ success: true, user: this.user, accesstoken: "JWT token" });
    }
}
//# sourceMappingURL=user.controller.js.map