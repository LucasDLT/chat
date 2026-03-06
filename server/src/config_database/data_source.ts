import "reflect-metadata"
import { DataSource } from "typeorm";
import { Message } from "./entities/Message";
import { User } from "./entities/User";
import { envs_parse } from "../schemas/env.schema";

export const AppDataSource = new DataSource({
    type:"postgres",
    host:envs_parse.host,
    port:Number(envs_parse.port),
    username:envs_parse.username,
    password:envs_parse.password,
    database:envs_parse.database,
    synchronize:false,
    //logging:true,
    entities:[User, Message],
    //subscribers:[],
    //migrations:["src/migrations/*.ts"],
    dropSchema:false
})

//export const userRepository = AppDataSource.getRepository(User)
//export const messageRepository = AppDataSource.getRepository(Message)
//COMENTO ESTO PARA FORZAR ERROR EN LOS ARCHIVOS DONDE DEBO HACER LOS CAMBIOS DEL DATASOURCE LOCAL AL CONECTADO A NEON