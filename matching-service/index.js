const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { initSocket } = require("./utils/socket-io");
const { findMatch, cancelMatch } = require("./handler/match-handler");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.ENV === "PRODUCTION") {
  app.use(cors())
  app.options("*", cors());
} else {
  app.use(
    cors({
      origin: `http://localhost:${process.env.PORT || 3000}`,
      credentials: true,
    })
  )
}

app.get("/", (req, res) => {
  res.send("Hello World from matching-service");
});

const httpServer = createServer(app);
initSocket(httpServer, findMatch, cancelMatch);

httpServer.listen(8001);
