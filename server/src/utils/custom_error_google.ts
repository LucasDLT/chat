import { GoogleOAuthErrorCode } from "../types/google_auth.error";
import { Response } from "express";

export const switch_error =(err:GoogleOAuthErrorCode, res:Response)=>{
      let message="Error de conexion de Google"
      switch (err.code) {
        case "AUD_MISMATCH": {
          message="Error temporal de autenticacion, intenta nuevamente"
          break;
        }
        case "AUTH_CODE_MISSING": {
          message
          break;
        }
        case "INVALID_GOOGLE_RESPONSE": {
          message="Error al iniciar sesion en Google, intenta nuevamente"
          break;
        }
        case "TOKEN_EXCHANGE_FAILED": {
          message
          break;
        }
        case "USER_INFO_MISSING": {
          message="Error al intentar autenticar tu cuenta Google"
          break;
        }
      }
      res.redirect(`http://localhost:3000/login/error?message=${encodeURIComponent(message)}`)
    
}