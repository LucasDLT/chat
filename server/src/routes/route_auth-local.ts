import {router} from "./router.js"
import { register_controller } from "../controllers/register_controller.js"
import { login_controller } from "../controllers/login_controller.js"
import { logout_controller } from "../controllers/logout_controller.js"
import {verify_auth} from "../middlewares/middleware_auth.js"

router.post("/auth/register", register_controller)
router.post("/auth/login", login_controller)
router.post("/auth/logout", verify_auth, logout_controller)

export default router
