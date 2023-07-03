import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import "dotenv/config";
import { UserService } from "./src/service";
import { Server } from "./src/server";
const thread = process.argv.slice(2)[0];

const numWorkers = thread === "multi" ? availableParallelism() : 1;
// console.log("numWorkers ", numWorkers);
const PORT = Number(process.env.PORT);
const workers = {};
if (cluster.isPrimary) {
  //   console.log(`Primary ${process.pid} is running`);
  const db = {
    users: [
      { id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", usename: "Alex", age: 45, hobbies: ["dev", "travel"] },
      { id: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed", usename: "Yan", age: 1, hobbies: [] },
    ],
  };
  for (let i = 0; i < numWorkers; i++) {
    workers[i] = cluster.fork();
    workers[i].on("message", (upDb) => {
      db.users = upDb;
      updetaDB(db);
    });
  }
  function updetaDB(db) {
    Object.values(cluster.workers).forEach((worker) => {
      worker.send(db);
    });
  }
  updetaDB(db);

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const addon = cluster.worker.id - 1;
  const server = new Server(PORT + addon, UserService);
  server.start();
}

//todo singletone for db ?
