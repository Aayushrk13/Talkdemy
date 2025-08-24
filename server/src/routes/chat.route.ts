import { Router } from "express";
import { getclasses } from "../controller/chat.controller";
const router = Router();

router.get("/classes/:user_id", getclasses);


export default router;
