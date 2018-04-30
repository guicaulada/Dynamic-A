const express = require("express");
const http = require("http");
const app = express();
app.use(express.static("./public"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});
const server = http.createServer(app);
server.listen(9900)
console.log("Webserver listening on port 9900");