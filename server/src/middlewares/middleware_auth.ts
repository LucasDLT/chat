import { Response, Request, NextFunction } from "express";
import { envs_parse } from "../schemas/env.schema.js";
import jwt from "jsonwebtoken";

export const verify_auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = envs_parse.jwt_secret_key;
  const cookie_auth_google = req.cookies.login_auth_google;
  const cookie_login_session = req.cookies.login_session;

  if (!cookie_auth_google && !cookie_login_session) {
    throw new Error("Error de conexion al verificar al usuario");
  }

  if (cookie_auth_google) {
    const verify = jwt.verify(cookie_auth_google, secret) as { id: number }; //en contra de mi intento de no usar aserciones, la agregamos por que el tipado interno de jwt no es conocido por ts, solo aparece string | JwtPayload

    const id = verify.id;

    if (!id) {
      throw new Error("Error de conexion al verificar al usuario");
    } else {
      req.id = id;
      next();
    }
  }
  if (cookie_login_session) {
    const verify = jwt.verify(cookie_login_session, secret) as { id: number }; //en contra de mi intento de no usar aserciones, la agregamos por que el tipado interno de jwt no es conocido por ts, solo aparece string | JwtPayload

    const id = verify.id;

    if (!id) {
      throw new Error("Error de conexion al verificar al usuario");
    } else {
      req.id = id;
      next();
    }
  }
};

declare global {
  namespace Express {
    interface Request {
      id?: number;
    }
  }
}
