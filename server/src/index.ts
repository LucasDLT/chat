import { createServer } from "http";
import { websocketSetup } from "./websoquet.setup";
const express = require("express");
const app = express();
const server = createServer(app);

server.listen(3001, () => {
    console.log("Server is running on port 3001");
    websocketSetup(server)

});

