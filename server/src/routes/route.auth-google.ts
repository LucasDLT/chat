import { router } from "./router.js";
import { auth_google } from "../controllers/auth_google.controller.js";
import { auth_google_callback } from "../controllers/auth_google_callback.js";
import { verify_auth } from "../middlewares/middleware_auth.js";


router.get('/auth/google', auth_google)

router.get('/auth/google/callback', auth_google_callback)

router.get('/auth/me', verify_auth, )

export default router