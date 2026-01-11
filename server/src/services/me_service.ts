import { res_user } from "../types/dtos_user_register.js";
import { userRepository } from "../config_database/data_source.js";

export const me_service = async (id: number): Promise<res_user> => {
  let id_user = id;
  const user = await userRepository.findOne({
    where: { id: id_user },
  });
  if (!user) throw new Error("Error inesperado, intente nuevamente");

  const data_user: res_user = {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
  };

  return data_user;
};