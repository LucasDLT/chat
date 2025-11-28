let timer: number | null = null;
let timerOut: number | null = null;

let timerOutmsg = 25000; //voy a probar con 25segundos por ping
let timerInterval = 15000; //y cada 15segundos esperamos el pong

export function cleanIntervals() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (timerOut) {
    clearTimeout(timerOut);
    timerOut = null;
  }
}
export function startHeartbeat(ws: WebSocket) {
  cleanIntervals();
  timer = window.setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(
          JSON.stringify({
            type: "ping.client",
            timestamp: Date.now(),
          })
        );
        console.log("envio de ping");
      } catch (error) {
        console.log("error enviando ping client to server", error);
      }
    }
    timerOut = window.setTimeout(() => {}, timerOutmsg);
  }, timerInterval);
}
