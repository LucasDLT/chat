import { User } from "../config_database/entities/User";

export interface dto_data_user {
  name: string;
  email: string;
  password: string;
}
export interface dto_data_login {
  email: string;
  password: string;
}

export interface dto_user {
  token: string;
  user: dto_public_user;
}

export type dto_public_user = Pick<
  User,
  | "id"
  | "email"
  | "name"
  | "password"
  | "provider"
  | "receivedMessages"
  | "setMessages"
>; //esto lo saque de la docu de typescript. Pick crea un tipo nuevo, en este caso recibe una clase que uso para la entidad usuario, y saca las propiedades que le ingrese, asi dejo el pass fuera.