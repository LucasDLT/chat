import { event_bus } from "../events/events.bus"


export const logout_service = async (id:number)=>{
if (!id) {
    throw new Error("Error de conexion, intente nuevamente")
}
event_bus.emit("logout", {id})

}