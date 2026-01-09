import { User } from "../config_database/entities/User.js";

export interface dto_data_user {
  //para el register
  name: string;
  email: string;
  password: string;
}
export interface dto_data_login {
  //para el login
  email: string;
  password: string;
}
export type dto_public_user = Pick<User, "id" | "email" | "name" | "provider">; //esto lo saque de la docu de typescript. Pick crea un tipo nuevo, en este caso recibe una clase que uso para la entidad usuario, y saca las propiedades que le ingrese, asi dejo el pass fuera.
export type dto_public_user_whit_relation = Pick<//a este lo vamos a usar cuando hagamos las rutas de las relaciones hacia el cliente.
  User,
  | "id"
  | "email"
  | "name"
  | "password"
  | "provider"
  | "receivedMessages"
  | "setMessages"
>;
export interface dto_user {
  //para el servicio hacia el controlador
  token: string;
  user: dto_public_user;
}
export interface dto_user_google {
  token: string;
}

export type res_user = Pick<
  //para el controlador hacia el cliente
  User,
  "id" | "email" | "name" | "provider"
>;
export type res_user_relation = Pick<
  //tipado para cuando traiga las relaciones, le agregamos los mensajes
  User,
  "id" | "email" | "name" | "provider" | "receivedMessages" | "setMessages"
>;
