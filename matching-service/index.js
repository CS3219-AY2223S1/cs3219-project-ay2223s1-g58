const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { initSocket } = require("./utils/socket-io");
const { findMatch, cancelMatch } = require("./handler/match-handler");
const roomRoutes = require("./routes/RoomRoutes");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: `http://localhost:${process.env.PORT || 3000}`,
    credentials: true,
  })
); // config cors so that front-end can use
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello World from matching-service");
});

const URL_PREFIX = "/api/v1/matching";

app.use(`${URL_PREFIX}/room`, roomRoutes);

const httpServer = createServer(app);
initSocket(httpServer, findMatch, cancelMatch);

httpServer.listen(8001);
