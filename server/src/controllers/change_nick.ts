import { Request, Response } from "express"
import { change_nick_service } from "../services/change_nick.js"
export const change_nickname_controller=async(req:Request, res:Response)=>{
try{
    const id = req.id
if (!id) {
    throw new Error("Error inesperado al intentar cambiar el nombre, intente nuevamente")
}
const {new_name} = req.body
if (!new_name) {
    throw new Error("Error al recibir el nuevo nombre, intente nuevamente")
}
const new_user = await change_nick_service(id, new_name)

res.status(200).json({
    message:"Cambio de nombre exitoso",
    new_user
})
}catch(error){
res.status(400).json({message:error})
}
}