import z from "zod"
import { ID_CLIENT, SECRET_CLIENT,BDD_DATABASE,BDD_HOST,BDD_PASSWORD,BDD_PORT,BDD_USERNAME, JWT_SECRET } from "../envs"

const env_schema = z.object({
    client_id:z.string(),
    secret_client:z.string(),
    database:z.string(),
    host:z.string(),
    password:z.string(),
    port:z.string(),
    username:z.string(),
    jwt_secret_key:z.string()
})

export const envs_parse= env_schema.parse({
client_id:ID_CLIENT,
secret_client:SECRET_CLIENT,
database:BDD_DATABASE,
host:BDD_HOST,
password:BDD_PASSWORD,
port:BDD_PORT,
username:BDD_USERNAME,
jwt_secret_key:JWT_SECRET
}) 