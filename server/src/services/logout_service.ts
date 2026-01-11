import { event_bus } from "../events/events.bus.js"


export const logout_service = async (id:number)=>{
if (!id) {
    throw new Error("Error de conexion, intente nuevamente")
}
event_bus.emit("logout", {user_id:id})

}