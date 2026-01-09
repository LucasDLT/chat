import { userRepository } from "../config_database/data_source.js"
import { event_bus } from "../events/events.bus.js"
import { dto_public_user } from "../types/dtos_user_register.js"

export const change_nick_service=async(id:number, new_name:string):Promise<dto_public_user>=>{
const id_user:number=id
const res_bdd= await userRepository.findOne({
    where:{id:id_user}
})
if (!res_bdd) {
    throw new Error("Error al realizar cambio de nombre")
}

res_bdd.name=new_name

const user = await userRepository.save(res_bdd)

if (!user) {
    throw new Error("Error inesperado al guardar el nombre")
}

event_bus.emit("change.nickname", { id, new_name });


const new_user: dto_public_user = {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
}

return new_user
}