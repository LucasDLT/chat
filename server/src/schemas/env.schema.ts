import z from "zod"
import { ID_CLIENT, SECRET_CLIENT } from "../envs"

const env_schema = z.object({
    client_id:z.string(),
    secret_client:z.string()
})

export const envs_parse= env_schema.parse({
client_id:ID_CLIENT,
secret_client:SECRET_CLIENT
})