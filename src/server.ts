import http from "http";
import url from "url";

//
console.log(http.STATUS_CODES[404]);
const PORT = 4000;
const requestListener = (req, res) => {
  res.end("Hi");
};

const server = http.createServer();
server.on("request", requestListener);
server.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
