import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import "dotenv/config";
import { UserService } from "./src/service";
import { Server } from "./src/server";

const numWorkers = availableParallelism() - 1;
// console.log("numWorkers ", numWorkers);
const PORT = Number(process.env.PORT);
const workers = {};
if (cluster.isPrimary) {
  //   console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numWorkers; i++) {
    workers[i] = cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const addon = cluster.worker.id - 1;
  const server = new Server(PORT + addon, UserService);
  server.start();
}

//todo singletone for db ?
