import "reflect-metadata"
import { DataSource } from "typeorm";
import { Message } from "./entities/Message.js";
import { User } from "./entities/User.js";
import { envs_parse } from "../schemas/env.schema.js";

const MigrationAppDataSource = new DataSource({
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
    migrations:["src/migrations/*.ts"],
    dropSchema:false
})
export default MigrationAppDataSource