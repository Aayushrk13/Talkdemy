import { Router } from "express"
import {createGroup, getGroups,loginbytokenadmin,search_student,search_teacher,getAllMembersofGroup, editGroup, deleteGroup, getmessagesAdmin, getUser} from "../controller/admin.controller.js"


const router = Router();

router.route("/loginbytoken").get(loginbytokenadmin);

router.route("/groups").get(getGroups);

router.route("/getsearched_student").get(search_student);

router.route("/getsearched_teacher").get(search_teacher);

router.route("/getmembers").post(getAllMembersofGroup);

router.route("/creategroup").post(createGroup);

router.route("/editgroup").post(editGroup).delete(deleteGroup);

router.route("/getmessagesAdmin").get(getmessagesAdmin);

router.route("/getuser").get(getUser);
export default router;