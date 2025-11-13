import Router from "express";
import {login,register,loginByToken, logout} from "../controller/user.controller.js"
const router = Router()

router.post("/login",login)

router.post("/register",register)

router.route("/logout").get(logout);

router.get("/auth",loginByToken)
export default router;