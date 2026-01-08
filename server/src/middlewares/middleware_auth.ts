import { Response, Request, NextFunction } from "express";
import { envs_parse } from "../schemas/env.schema.js";
import { userRepository } from "../config_database/data_source.js";

export const verify_auth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = envs_parse.jwt_secret_key;
  const cookie = req.cookies.login_session;
  const verify = cookie.veryfy({ cookie }, secret);
  if (!verify) {
    throw new Error("Error de conexion al verificar al usuario");
  } else {
    const decode_id = cookie.decode(cookie);
    const user = userRepository.findOne({
      where: { id: decode_id },
    });
    req.body = user;
    next();
  }
};
