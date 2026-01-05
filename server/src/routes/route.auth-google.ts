import { router } from "./router.js";
import { auth_google } from "../controllers/auth_google.controller.js";
import { auth_google_callback } from "../controllers/auth_google_callback.js";


router.get('/auth/google', auth_google)

router.get('/auth/google/callback', auth_google_callback)

export default router