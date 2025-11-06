import { Router } from "express"
import {createGroup, getGroups,loginbytokenadmin,search_student,search_teacher} from "../controller/admin.controller.js"


const router = Router();

router.route("/loginbytoken").get(loginbytokenadmin);

router.route("/groups").get(getGroups);

router.route("/getsearched_student").get(search_student);

router.route("/getsearched_teacher").get(search_teacher);

router.route("/creategroup").post(createGroup);
export default router;