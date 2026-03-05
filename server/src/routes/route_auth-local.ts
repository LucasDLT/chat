import {router} from "./router"
import { register_controller } from "../controllers/register_controller"
import { login_controller } from "../controllers/login_controller"
import { logout_controller } from "../controllers/logout_controller"
import {verify_auth} from "../middlewares/middleware_auth"

router.post("/auth/register", register_controller)
router.post("/auth/login", login_controller)
router.post("/auth/logout", verify_auth, logout_controller)

export default router
