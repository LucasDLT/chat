import { Response, Request, NextFunction } from "express";
import { envs_parse } from "../schemas/env.schema.js";
import jwt from "jsonwebtoken";

export const verify_auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = envs_parse.jwt_secret_key;
  const cookie = req.cookies.login_session;
  if (!cookie) {
    throw new Error("Error de conexion al verificar al usuario");
  }
  const verify = jwt.verify(cookie, secret);
  const id = Number(verify);
  if (!id) {
    throw new Error("Error de conexion al verificar al usuario");
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
