import { createServer } from "http";
import { websocketSetup } from "./websoquet.setup";
const express = require("express");
const app = express();
const server = createServer(app);



websocketSetup(server)