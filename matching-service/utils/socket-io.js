/* eslint-disable no-param-reassign */
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const { EVENT_LISTEN, ALLOWED_ORIGINS } = require("../const/constants");
require("dotenv").config();

const pubClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`,
});

const subClient = pubClient.duplicate();

let io;
exports.initSocket = (httpServer, matchHandler, cancelHandler) => {
  io = new Server(httpServer, {
    cors: {
      origin: ALLOWED_ORIGINS,
      methods: ["GET", "POST"],
    },
    credentials: true,
  });
  // redis adapter
  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
  });
  console.log("Redis adapter connected...");

  io.path("/socket.io/matching");
  io.use((socket, next) => {
    try {
      const { token } = socket.handshake.auth;
      // TODO update to verify when expired token is fixed
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
        ignoreExpiration: true,
      });
      console.log("middleware payload", payload);
      socket.userId = payload.username;
      next();
    } catch (e) {
      console.log(e);
      next(e);
    }
  });
  io.on("connection", (socket) => {
    socket.on(EVENT_LISTEN.MATCH_FIND, matchHandler);
    socket.on(EVENT_LISTEN.MATCH_CANCEL, cancelHandler);
    socket.on(EVENT_LISTEN.DISCONNECT, cancelHandler);
  });
};

exports.sendMessageToBoth = (firstSocket, secondSocket, event, message) =>
  io.to(firstSocket).to(secondSocket).emit(event, message);

exports.sendMessageToOne = (socket, event, message) =>
  io.to(socket).emit(event, message);

exports.emit = (event, message) => io.emit(event, message);

exports.isSocketActive = (socket) =>
  io.sockets.sockets.get(socket) !== undefined;
