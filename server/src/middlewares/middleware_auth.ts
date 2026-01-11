import { Response, Request, NextFunction } from "express";
import { select_session } from "../utils/verify_session.js";
import { log } from "node:console";

export const verify_auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookie_auth_google = req.cookies.login_auth_google;
  const cookie_login_session = req.cookies.login_session;

  if (!cookie_auth_google && !cookie_login_session) {
    throw new Error("Error de conexion al verificar al usuario 1");
  }
  const id = await select_session(cookie_auth_google, cookie_login_session);

  req.id = id;
  
  next()
};

declare global {
  namespace Express {
    interface Request {
      id?: number;
    }
  }
}
