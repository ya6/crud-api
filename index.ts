import "dotenv/config";

import { UserService } from "./src/service";
import { Server } from "./src/server";

const PORT = process.env.PORT;
const server = new Server(Number(PORT), UserService);

server.start();
// setTimeout(() => {
//   server.stop();
// }, 2000);
