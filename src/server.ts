import http from "http";
import { parse } from "url";
import { UserService } from "./service";

//
const userService = new UserService();
const PORT = 4000;
const requestListener = (req, res) => {
  const { method, url } = req;
  const URL = parse(url, true);
  let segmented_pathname: string[] = [];
  if (URL.pathname) {
    segmented_pathname = URL.pathname.split("/");
  }

  // console.log(URL);
  // console.log(http.STATUS_CODES[404]);
  // get /
  if (method === "GET" && URL.pathname === "/") {
    res.statusCode = 200;
    res.end(`${"Home"}`);
  }
  // get/api/users
  if (method === "GET" && URL.pathname === "/api/users") {
    const users = userService.getAllUsers();
    const strUsers = JSON.stringify(users);
    res.statusCode = 200;
    res.end(strUsers);
    try {
    } catch (error: any) {
      res.statusCode = 400;
      return res.end(`error: ${error.message}`);
    }
  }
  // get/api/users/id
  if (method === "GET" && segmented_pathname[1] === "api" && segmented_pathname[2] === "users" && !!segmented_pathname[3]) {
    const checkedId = userService.validateId(segmented_pathname[3]);
    if (checkedId === "invalid") {
      res.statusCode = 400;
      return res.end(`invalid ID`);
    }
    const user = userService.getUserById(checkedId);
    console.log(checkedId);
    console.log(user);
    if (user) {
      res.statusCode = 200;
      return res.end(JSON.stringify(user));
    }
    res.statusCode = 404;
    return res.end(`user doesn't exist`);
  }

  if (method === "POST" && URL.pathname === "/api/users") {
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
          res.statusCode = 201;
          return res.end(JSON.stringify(user));
        } catch (error: any) {
          res.statusCode = 400;
          return res.end(`error: ${error.message}`);
        }
      });
  }
};

const server = http.createServer();
server.on("request", requestListener);
server.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
