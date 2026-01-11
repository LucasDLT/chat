import "ws";

declare module "ws" {
  interface WebSocket {
    userId?: number;// lo tengo que generar con cripto uuid
    isAlive?: boolean;
    nickname?: string;
  }
}//extendemos la interfaz de websockets directamente desde el objeto ws, le agrego isAlive para el ping-pong y ademas el userId para identificar al usuario junto al nickname
