import http from "http";
import { parse } from "url";
import { UserService } from "./service";

//
const userService = new UserService();
console.log(http.STATUS_CODES[404]);
const PORT = 4000;
const requestListener = (req, res) => {
  const { method, url } = req;
  const URL = parse(url, true);
  // console.log(URL);

  if (method === "GET" && URL.pathname === "/") {
    res.end(`${"Home"}`);
  }
  if (method === "GET" && URL.pathname === "/api/users") {
    const users = userService.getAllUsers();
    res.end(`${method} --- ${URL.pathname}`);
  }
  let body: any[] = [];
  req
    .on("data", (chank) => {
      body.push(chank);
    })
    .on("end", () => {
      try {
        const bufferToString = Buffer.concat(body).toString("utf-8");
        const parsedJson = JSON.parse(bufferToString);
        console.log(parsedJson);
        res.statusCode = 201;
        return res.end();
      } catch (error: any) {
        res.statusCode = 400;
        return res.end(`error: ${error.message}`);
      }
    });
};

const server = http.createServer();
server.on("request", requestListener);
server.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
