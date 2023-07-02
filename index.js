"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const service_1 = require("./src/service");
const server_1 = require("./src/server");
const PORT = process.env.PORT;
const server = new server_1.Server(Number(PORT), service_1.UserService);
server.start();
// setTimeout(() => {
//   server.stop();
// }, 2000);
