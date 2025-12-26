import { router } from "./router";
import { auth_google } from "../controllers/auth_google.controller";
import { auth_google_callback } from "../controllers/auth_google_callback";


router.get('/auth/google', auth_google)

router.get('/auth/google/callback', auth_google_callback)

export default router