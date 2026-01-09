import { Router } from "express";
import { getclasses,getmembers,get_messages, uploadfile, checktoxicity, getTeacher, getGroupInvites, getUser, handle_groupinvite } from "../controller/chat.controller";
import {getGroupMemberCache,getMessagesCache} from "../middleware/caching.middleware";
const router = Router();

import multer from "multer";
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "@" + file.originalname); 
  }
});


const upload = multer({ storage });

router.route("/classes").get(getclasses);

router.route("/members").post(getGroupMemberCache,getmembers);

router.route("/messages/:group_id/:page").get(getMessagesCache,get_messages);

router.route("/upload").post(upload.single("file"),uploadfile);

router.route("/getteacher").get(getTeacher);
router.route("/checktoxicity").post(checktoxicity);
router.route("/getinvites").get(getGroupInvites);
router.route("/getuser").get(getUser);
router.route("/handlegroupinvite").post(handle_groupinvite);
export default router;
