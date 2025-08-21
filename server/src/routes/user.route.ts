import Router from "express";
import {login,register,loginByToken} from "../controller/user.controller.js"
const router = Router()

router.post("/login",login)

router.post("/register",register)

router.get("/auth",loginByToken)
export default router;