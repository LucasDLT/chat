import { AuthProvider } from "../domain/enum/auth_provider_enum.js";
import { envs_parse } from "../schemas/env.schema.js";
//const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";

export const create_session = async (id: number): Promise<string> => {
  const secret = envs_parse.jwt_secret_key;
  const token = jwt.sign({ id, provider: AuthProvider.LOCAL }, secret, {
    expiresIn: "7d",
  });
  return token;
};

export const session_google = async (id: number): Promise<string> => {
  const secret = envs_parse.jwt_secret_key;
  const token = jwt.sign({ id, provider: AuthProvider.GOOGLE }, secret, {
    expiresIn: "7d",
  });
  return token;
};
