import { Router } from "express";
import { getclasses,getmembers,get_messages } from "../controller/chat.controller";
const router = Router();

router.route("/classes/:user_id").get(getclasses);

router.route("/members").post(getmembers);

router.route("/messages/:group_id").get(get_messages)

export default router;
