import { User } from "../config_database/entities/User.js";

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
export interface dto_user_google{
  token:string;
  user:dto_google_auth;
}

export type dto_google_auth=Pick<
User,
  | "id"
  | "email"
  | "name"
  | "password"
  | "provider"
  | "google_id"
  | "receivedMessages"
  | "setMessages"
>
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