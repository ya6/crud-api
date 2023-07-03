import http from "http";
import { parse } from "url";
import { UserService1 } from "./service1";
import "dotenv/config";

export class Server1 {
  private port: number;
  private server;
  private userService: UserService1;
  private db;
  constructor(port: number, UserService1) {
    this.port = port;
    this.userService = new UserService1();
    this.server = http.createServer();
    this.userService.setUsers([
      { id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", usename: "Alex", age: 45, hobbies: ["dev", "travel"] },
      { id: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed", usename: "Yan", age: 1, hobbies: [] },
    ]);
  }

  requestListener(req, res, userService, db) {
    const { method, url } = req;
    const URL = parse(url, true);
    let segmented_pathname: string[] = [];
    if (URL.pathname) {
      segmented_pathname = URL.pathname.split("/");
    }

    // get /
    if (method === "GET" && URL.pathname === "/") {
      res.statusCode = 200;
      res.setHeader("content-type", "text/html");
      return res.end(`
    <div style="margin: 3rem">
      <h2>Crud API</h3>
      <h3>Endpoints:</h4>
      <p><b>GET</b> api/users</p>
      <p><b>GET</b> api/users/{userId}</p>
      <p><b>POST</b> api/users</p>
      <p><b>PUT</b> api/users/{userId}</p>
      <p><b>DELETE</b> api/users/{userId}</p>
    </div>
    `);
    }
    // get/api/users
    else if (method === "GET" && URL.pathname === "/api/users") {
      const users = userService.getAllUsers();
      const strUsers = JSON.stringify(users);
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.end(strUsers);
      try {
      } catch (error: any) {
        res.statusCode = 500;
        return res.end(`error: ${error.message}`);
      }
    }
    // get/api/users/id
    else if (method === "GET" && segmented_pathname[1] === "api" && segmented_pathname[2] === "users" && !!segmented_pathname[3]) {
      const checkedId = userService.validateId(segmented_pathname[3]);
      if (checkedId === "invalid") {
        res.statusCode = 400;
        return res.end(`invalid ID`);
      }
      const user = userService.getUserById(checkedId);

      if (user) {
        res.statusCode = 200;
        res.setHeader("content-type", "application/json");
        return res.end(JSON.stringify(user));
      }
      res.statusCode = 404;
      return res.end(`user doesn't exist`);
    } else if (method === "POST" && URL.pathname === "/api/users") {
      let body: any[] = [];
      req
        .on("data", (chank) => {
          body.push(chank);
        })
        .on("end", () => {
          try {
            const userDto = userService.parseToJson(body);
            const validatedErrors = userService.validateUserDto(userDto);

            if (validatedErrors.length > 0) {
              res.statusCode = 400;
              return res.end(JSON.stringify(validatedErrors));
            }

            // create user
            const user = userService.createUser(userDto);
            res.setHeader("content-type", "application/json");
            res.statusCode = 201;
            return res.end(JSON.stringify(user));
          } catch (error: any) {
            res.statusCode = 500;
            return res.end(`error: ${error.message}`);
          }
        });
    } else if (method === "PUT" && segmented_pathname[1] === "api" && segmented_pathname[2] === "users" && !!segmented_pathname[3]) {
      let body: any[] = [];
      req
        .on("data", (chank) => {
          body.push(chank);
        })
        .on("end", () => {
          try {
            const userDto = userService.parseToJson(body);
            const validatedErrors = userService.validateUserDto(userDto);

            if (validatedErrors.length > 0) {
              res.statusCode = 400;
              return res.end(JSON.stringify(validatedErrors));
            }
            // check id
            const checkedId = userService.validateId(segmented_pathname[3]);
            if (checkedId === "invalid") {
              res.statusCode = 400;
              return res.end(`invalid ID`);
            }
            // update user
            const user = userService.updateUser(checkedId, userDto);
            if (user) {
              res.statusCode = 200;
              res.setHeader("content-type", "application/json");
              return res.end(JSON.stringify(user));
            }
            res.statusCode = 404;
            return res.end(`user doesn't exist`);
          } catch (error: any) {
            res.statusCode = 500;
            return res.end(`error: ${error.message}`);
          }
        });
    } else if (method === "DELETE" && segmented_pathname[1] === "api" && segmented_pathname[2] === "users" && !!segmented_pathname[3]) {
      const checkedId = userService.validateId(segmented_pathname[3]);
      if (checkedId === "invalid") {
        res.statusCode = 400;
        return res.end(`invalid ID`);
      }
      // del user
      const result = userService.deleteUser(checkedId);
      if (result) {
        res.statusCode = 204;
        return res.end();
      }

      res.statusCode = 404;
      return res.end(`user doesn't exist`);
    } else {
      res.statusCode = 404;
      return res.end(`Route not found`);
    }
  }

  start() {
    this.server.on("request", (req, res) => {
      this.requestListener(req, res, this.userService, this.db);
    });
    this.server.listen(this.port, () => {
      console.log(`Server is running on ${this.port} port`);
    });
  }

  stop() {
    this.server.close();
  }

  getServer() {
    return this.server;
  }
}
