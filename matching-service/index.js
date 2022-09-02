const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { initSocket } = require("./utils/socket-io.js");
const findMatch = require("./handler/match-handler.js");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello World from matching-service");
});

const httpServer = createServer(app);
initSocket(httpServer, findMatch);

httpServer.listen(8001);
