import Router from "express";
import {login} from "../controller/user.controller.js"
const router = Router()

router.post("/login",login)

router.post("/signup",)

export default router;