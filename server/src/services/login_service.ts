import { userRepository } from "../config_database/data_source_migration";
import { AuthProvider } from "../domain/enum/auth_provider_enum";
import {
  dto_data_login,
  dto_public_user,
  dto_user,
} from "../types/dtos_user_register";
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

  if (res_db && res_db.password) {
    const res_password = await compare_password(password, res_db.password);
    if (!res_password) {
      throw new Error("La contraseña es erronea");
    }
    const user: dto_public_user = {
      id: res_db.id,
      email: res_db.email,
      name: res_db.name,
      provider: AuthProvider.LOCAL,
    }; 
    const session = await create_session(res_db.id);
    const data_user: dto_user = {
      token: session,
      user: user,
    };
    return data_user;
  } else {
    throw new Error("Error al loguearse");
  }
};
 