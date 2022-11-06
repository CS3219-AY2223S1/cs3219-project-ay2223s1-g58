/* eslint-disable no-param-reassign */
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;
exports.initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    credentials: true,
  });
  io.path("/socket.io/room");
  io.use((socket, next) => {
    try {
      const { token } = socket.handshake.auth;
      // TODO update to verify when expired token is fixed
      const payload = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("middleware payload", payload);
      socket.userId = payload.username;
      next();
    } catch (e) {
      console.log(e);
      next(e);
    }
  });
  io.on("connection", (socket) => {
    console.log("connection here");
    socket.on("join-room", (payload) => {
      console.log("join-room payload", payload);
      // Assuming that I have access to userId
      console.log(socket.userId);
      const { roomId, userId } = payload;

      socket.join(roomId);
      socket.to(roomId).emit("user-connected", userId);

      socket.on("disconnect", () => {
        socket.to(roomId).emit("user-disconnected", userId);
      });
    });
  });
};

exports.sendMessageToBoth = (firstSocket, secondSocket, event, message) =>
  io.to(firstSocket).to(secondSocket).emit(event, message);

exports.sendMessageToOne = (socket, event, message) =>
  io.to(socket).emit(event, message);

exports.emit = (event, message) => io.emit(event, message);

exports.isSocketActive = (socket) =>
  io.sockets.sockets.get(socket) !== undefined;
