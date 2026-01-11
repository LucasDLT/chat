import { envs_parse } from "../schemas/env.schema.js";
import jwt from "jsonwebtoken";
export const select_session = async (
  cookie_auth_google: string,
  cookie_login_session: string
): Promise<number> => {
  const secret = envs_parse.jwt_secret_key;
  let id;
  if (cookie_auth_google) {
    const verify = jwt.verify(cookie_auth_google, secret) as { id: number };
    id = verify.id;
  }
  if (cookie_login_session) {
    const verify = jwt.verify(cookie_login_session, secret) as { id: number };
    id = verify.id;
  }
  if (typeof id !== "number") {
    throw new Error("Fallo la verificacion de identidad")
  }
  return id
};
