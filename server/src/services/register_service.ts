import { userRepository } from "../config_database/data_source";
import { User } from "../config_database/entities/User";
import { AuthProvider } from "../domain/enum/auth_provider_enum";
import { dto_data_user, dto_register_user } from "../types/dtos_user_register";
import { hash_password } from "../utils/create_hash_password";
import { create_session } from "../utils/create_session_token";

export const register_service = async ({
  name,
  email,
  password,
}: dto_data_user): Promise<dto_register_user> => {
  if (!name && !email && !password)
    throw new Error("los datos ingresados (nombre y correo) no son validos");

  const res_db = await userRepository
    .createQueryBuilder("user")
    .where("user.name = :name", { name })
    .andWhere("user.email = :email", { email })
    .getOne();

  if (res_db) {
    throw new Error("ya existe un usuario con los datos ingresados");
  } else {
    const res_password = await hash_password(password);

    const data_user = new User();
    data_user.name = name;
    data_user.email = email;
    data_user.password = res_password;
    data_user.provider = AuthProvider.LOCAL
    const register_user = await userRepository.save(data_user);

    const session = await create_session(register_user.id);

    const data_to_controller: dto_register_user = {
      token: session,
      user: register_user,
    };
    return data_to_controller;
  }
};

//acordarse de poner en el dto del login esto:provider:local|google, para identificar que haer luego si auth o consulta bdd directa.
