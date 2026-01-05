import {router} from "./router"
import { register_controller } from "../controllers/register_controller"
import { login_controller } from "../controllers/login_controller"

router.post("/auth/register", register_controller)
router.post("/auth/login", login_controller)

export default router
