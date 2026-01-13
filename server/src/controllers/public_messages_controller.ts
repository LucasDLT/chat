import { get_all_public_msg } from "../services/public_messages_service.js"
import { Request, Response } from "express"

export const get_public_messages_controller = async (req:Request, res:Response)=>{
try{
    const limit = Number(req.query.limit)
    const offset = Number(req.query.offset)
    const user_id = req.id
    if (!user_id) {
        throw new Error("Error de autenticacion")
    }
    
    const messages_publics = await get_all_public_msg(user_id, limit, offset)

    res.status(200).json({
        message:"mensajes publicos",
        messages_publics
    })}catch(error){
        res.status(204).json({
            messages:error
        })
    }


}