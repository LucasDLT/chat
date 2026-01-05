import { userRepository } from "../config_database/data_source";
import { dto_data_login, dto_user } from "../types/dtos_user_register";
import { compare_password } from "../utils/create_hash_password";
import { create_session } from "../utils/create_session_token";

export const login_service = async ({
    password,
  email,
}: dto_data_login): Promise<dto_user> => {
  if (!password || !email) throw new Error("Datos invalidos");

  const res_db = await userRepository
    .createQueryBuilder("user")
    .where("user.email = :email", { email })
    .getOne();

  if (res_db) {
    const res_password = await compare_password(password, res_db.password);
    if (!res_password) {
      throw new Error("La contraseña es erronea");
    }
    const session = await create_session(res_db.id);
    const data_user: dto_user={
        token:session,
        user:res_db
    }
    return data_user
  } else {
    throw new Error("Error al loguearse");
  }
};
