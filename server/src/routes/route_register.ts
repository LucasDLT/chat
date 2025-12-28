import {router} from "./router"
import { register_controller } from "../controllers/register_controller"

router.post("/register", register_controller)

export default router
