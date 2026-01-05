import {router} from "./router.js"
import { register_controller } from "../controllers/register_controller.js"
import { login_controller } from "../controllers/login_controller.js"

router.post("/auth/register", register_controller)
router.post("/auth/login", login_controller)

export default router
