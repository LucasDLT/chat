import { envs_parse } from "../schemas/env.schema";
const jwt = require("jsonwebtoken");

export const create_session = async (id: number): Promise<string> => {
  const secret = envs_parse.jwt_secret_key;
  const token = jwt.sign({ id }, secret);
  return token;
};
