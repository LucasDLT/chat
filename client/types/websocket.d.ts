//esto lo creo para ir guardando los datos del cliente a medida se registre
export {}
 declare global{ 
 interface WebSocket {
    userId?: string;
    isAlive?: boolean;
    nickname?: string;
  }}