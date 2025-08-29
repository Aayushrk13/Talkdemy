import { Router } from "express";
import { getclasses,getmembers,handle_message } from "../controller/chat.controller";
const router = Router();

router.get("/classes/:user_id", getclasses);

router.route("/members").post(getmembers);

router.route("/sendmessage").post(handle_message);
export default router;
