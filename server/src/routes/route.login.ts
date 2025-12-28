import {router} from "./router"
import { login_controller } from "../controllers/login_controller"

router.post("/login", login_controller)

export default router
