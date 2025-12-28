import { envs_parse } from "../schemas/env.schema";
import { payload } from "../schemas/google-payload.schema";
import { data_schema } from "../schemas/google-token.schema";
import { GoogleOAuthErrorCode } from "../types/google_auth.error";
let jwt = require("jsonwebtoken");

interface dtoCallback {
  name: string;
  email: string;
  google_id: string;
  token: string;
}


export const service_auth_google_callback = async (code: string):Promise<dtoCallback> => {
if (!code) {
    throw new GoogleOAuthErrorCode("AUTH_CODE_MISSING","No se recibe auth-code en service_callback");
  }
  const client_id = envs_parse.client_id;
  const client_secret = envs_parse.secret_client;
  
    const form = new URLSearchParams({
      client_id: client_id,
      client_secret: client_secret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:3001/api/auth/google/callback",
    });

    const response = await fetch(`https://oauth2.googleapis.com/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
    const data = data_schema.parse(await response.json()) 
    if ("error" in data ) {
      throw new GoogleOAuthErrorCode("INVALID_GOOGLE_RESPONSE","Error al iniciar sesion con google");
    }
    const id_token = data.id_token;
    const access_token = data.access_token;

    const decode = jwt.decode(id_token);

    if (!decode || typeof decode !== "object") {
      throw new GoogleOAuthErrorCode("TOKEN_EXCHANGE_FAILED","Error al iniciar sesion con google");
    }

    const { sub, email, name, aud } = payload.parse(decode) 
    if (!sub || !email || !name ) {
      throw new GoogleOAuthErrorCode("USER_INFO_MISSING","la cuenta no pudo ser autenticada, por favor intenta de nuevo");
    }

    if (client_id !== aud) {
      throw new GoogleOAuthErrorCode("AUD_MISMATCH",
        "Error temporal en la autenticacion, por favor intenta de nuevo"
      );
    }

    const dataToController: dtoCallback = {
      name: name,
      email: email,
      google_id: sub,
      token: access_token,
    };
    return dataToController;
  
};
