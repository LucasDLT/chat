import "reflect-metadata"
import { createServer } from "http";
import { websocketSetup } from "./websoquet.setup";
import { json } from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
import auth_google_routes from "./routes/route.auth-google"; // anotacion: lo importado es un mero alias que le ponemos a toda la informacion que venga desde el origen de la importacion. De esta forma ahora las rutas que vengan de ahi, estan contenidas en authgoogle_routes.
import auth_local_routes from "./routes/route_auth-local"
import message_routes from "./routes/route_messages"
import MigrationAppDataSource from "./config_database/data_source_migration";
const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: ["http://localhost:3000", "https://livechat-ls.vercel.app/", "https://livechat-ls.vercel.app"],
    credentials: true
  })
);
app.use(json());
app.use(cookieParser());

app.use("/api", auth_google_routes); //anotacion2:la ruta que definimos aca no es una ruta a la que enviar o  mandar informacion, es una que le decimos al servidor que tiene que mostrar, asi ocultamos los paths internos de la app.
app.use("/", auth_local_routes)
app.use("/messages", message_routes )

server.listen(3001, () => {
  console.log("Server is running on port 3001");
  websocketSetup(server);
});

async function initApp() {
  try {
    await MigrationAppDataSource.initialize();
  } catch (error) {
    console.log(error);
  }
}
initApp()