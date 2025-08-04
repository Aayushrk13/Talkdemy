import Router from "express";
import { login } from "../controller/user.controller.js";
const router = Router();
router.get("/", login);
export default router;
//# sourceMappingURL=login.route.js.map