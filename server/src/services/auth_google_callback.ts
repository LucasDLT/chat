import { userRepository } from "../config_database/data_source.js";
import { User } from "../config_database/entities/User.js";
import { AuthProvider } from "../domain/enum/auth_provider_enum.js";
import { envs_parse } from "../schemas/env.schema.js";
import { payload } from "../schemas/google-payload.schema.js";
import { data_schema } from "../schemas/google-token.schema.js";
import { dto_user_google } from "../types/dtos_user_register.js";
import { GoogleOAuthErrorCode } from "../types/google_auth.error.js";
import jwt from "jsonwebtoken";
import { session_google } from "../utils/create_session_token.js";

export const service_auth_google_callback = async (
  code: string
): Promise<dto_user_google> => {
  if (!code) {
    throw new GoogleOAuthErrorCode(
      "AUTH_CODE_MISSING",
      "No se recibe auth-code en service_callback"
    );
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
  const data = data_schema.parse(await response.json());
  if ("error" in data) {
    throw new GoogleOAuthErrorCode(
      "INVALID_GOOGLE_RESPONSE",
      "Error al iniciar sesion con google"
    );
  }
  const id_token = data.id_token;
  const access_token = data.access_token;

  const decode = jwt.decode(id_token);

  if (!decode || typeof decode !== "object") {
    throw new GoogleOAuthErrorCode(
      "TOKEN_EXCHANGE_FAILED",
      "Error al iniciar sesion con google"
    );
  }

  const { sub, email, name, aud } = payload.parse(decode);
  if (!sub || !email || !name) {
    throw new GoogleOAuthErrorCode(
      "USER_INFO_MISSING",
      "la cuenta no pudo ser autenticada, por favor intenta de nuevo"
    );
  }

  if (client_id !== aud) {
    throw new GoogleOAuthErrorCode(
      "AUD_MISMATCH",
      "Error temporal en la autenticacion, por favor intenta de nuevo"
    );
  }
  //la query debe ser buscando id de google primero
  let user = await userRepository.findOne({where:{google_id:sub}})//como sub no esta en las propiedades le tengo que agregar el placeholder

  if (!user) {
    //luego buscamos por email si hay registro igual que como hicimos con la id antes
     user= await userRepository.findOne({where:{email}})//aca puedo poner directo email por que si esta en las propiedades
    //aca entramos al if anterior, y si hay mail registrado lo que hacemos es agregarle el id de google
    if (user) {
      user.google_id=sub
      user.provider=AuthProvider.GOOGLE
      await userRepository.save(user)
    }
  }
  //si tampoco hay email, quiere decir que es la primera vez que entra, entonces hacemos la carga completa
  if (!user) {
    user = userRepository.create({
      email:email,
      google_id:sub,
      name:name,
      provider:AuthProvider.GOOGLE,
    })
    await userRepository.save(user)
  }
  if (!user)throw new Error("error al autorizar tu cuenta google")
    const session = await session_google(user.id)
    const data_to_controller:dto_user_google={
      token:session,
      user:user
    }
    console.log(data_to_controller);
    
    return data_to_controller
  
};
