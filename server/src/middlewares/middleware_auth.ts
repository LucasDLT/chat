import { Response, Request, NextFunction } from "express";
import { envs_parse } from "../schemas/env.schema.js";
import jwt from "jsonwebtoken";

export const verify_auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = envs_parse.jwt_secret_key;
  const cookie = req.cookies.login_auth_google;

  if (!cookie) {
    throw new Error("Error de conexion al verificar al usuario");
  }
  const verify = jwt.verify(cookie, secret) as {id:number};//en contra de mi intento de no usar aserciones, la agregamos por que el tipado interno de jwt no es conocido por ts, solo aparece string | JwtPayload

  const id = verify.id
  
  if (!id) {
    throw new Error("Error de conexion al verificar al usuario en midd 2");
  } else {
    req.id = id;
    next();
  }
};

declare global {
  namespace Express {
    interface Request {
      id?: number;
    }
  }
}
