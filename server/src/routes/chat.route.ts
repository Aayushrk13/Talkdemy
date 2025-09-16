import { Router } from "express";
import { getclasses,getmembers,get_messages } from "../controller/chat.controller";
import {getGroupMemberCache,getMessagesCache} from "../middleware/caching.middleware";
const router = Router();

router.route("/classes/:user_id").get(getclasses);

router.route("/members").post(getGroupMemberCache,getmembers);

router.route("/messages/:group_id/:page").get(getMessagesCache,get_messages);

export default router;
