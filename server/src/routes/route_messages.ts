import { get_public_messages_controller } from "../controllers/public_messages_controller.js";
import { verify_auth } from "../middlewares/middleware_auth.js";
import { router } from "./router.js";

router.get("/public", verify_auth, get_public_messages_controller)

router.get("/private/:id", verify_auth, )

export default router