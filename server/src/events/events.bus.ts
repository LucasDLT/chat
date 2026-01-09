import EventEmitter from "events";

export const event_bus = new EventEmitter();
//datos de modelo nada mas, 
const id = 1;
const user = "pepe";

//esto va al wss
event_bus.on("change.nickname", ({id, user}) => {
//logica de cambio de nick que ya tenemos
});
