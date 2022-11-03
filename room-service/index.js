const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { initSocket } = require("./utils/socket-io");
const roomRoutes = require("./routes/RoomRoutes");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.options("*", cors());
app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello World from room-service");
});

const URL_PREFIX = "/api/v1/room";

app.use(URL_PREFIX, roomRoutes);

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(8022);
