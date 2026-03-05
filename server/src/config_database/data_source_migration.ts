import "reflect-metadata"
import "dotenv/config";
import { DataSource } from "typeorm";
import { Message } from "./entities/Message";
import { User } from "./entities/User";
import { envs_parse } from "../schemas/env.schema";

const MigrationAppDataSource = new DataSource({
    type:"postgres",
    url:envs_parse.database_url,
    synchronize:false,
    logging:true,
    entities:[User, Message],
    subscribers:[],
    migrations:["src/migrations/*.ts", "dist/migrations/*.js"],
    dropSchema:false,
    ssl:{
        rejectUnauthorized:false
    }
})

export default MigrationAppDataSource