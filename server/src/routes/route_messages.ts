import { private_messages_controller } from "../controllers/private_messages_controller.js";
import { get_public_messages_controller } from "../controllers/public_messages_controller.js";
import { search_priv_message } from "../controllers/search_private_message.js";
import { verify_auth } from "../middlewares/middleware_auth.js";
import { router } from "./router.js";

router.get("/public", verify_auth, get_public_messages_controller)

router.get("/private/:id", verify_auth, private_messages_controller) 

router.get("/private/search/:id",verify_auth, search_priv_message )
export default router