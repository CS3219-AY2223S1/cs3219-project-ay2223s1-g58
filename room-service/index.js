const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { initSocket } = require("./utils/socket-io");
const roomRoutes = require("./routes/RoomRoutes");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const allowedOrigins = [
  'http://localhost',
  'http://localhost:80',
  'http://localhost:3000',
  'http://localhost:8000',
  'http://localhost:8080',
  'http://localhost:8001',
  'http://localhost:8022',
  'http://localhost:8500',
  'http://localhost:9000',
  'https://leetwithfriend.com',
  'https://leetwithfriend.com:80',
  'https://www.leetwithfriend.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

app.get("/", (req, res) => {
  res.send("Hello World from room-service");
});

const URL_PREFIX = "/api/v1/room";

app.use(URL_PREFIX, roomRoutes);

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(8022);

module.exports = app;
