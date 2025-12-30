import {router} from "./router"
import { login_controller } from "../controllers/login_controller"

router.post("/auth/login", login_controller)

export default router
