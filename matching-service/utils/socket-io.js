const { Server } = require("socket.io");
const { EVENT_LISTEN } = require("../const/constants");

let io;
exports.initSocket = (httpServer, matchHandler, cancelHandler) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    socket.on(EVENT_LISTEN.MATCH_FIND, matchHandler);
    socket.on(EVENT_LISTEN.MATCH_CANCEL, cancelHandler);
  });
};

exports.sendMessageToBoth = (firstSocket, secondSocket, event, message) =>
  io.to(firstSocket).to(secondSocket).emit(event, message);

exports.sendMessageToOne = (socket, event, message) =>
  io.to(socket).emit(event, message);

exports.isSocketActive = (socket) =>
  io.sockets.sockets.get(socket) !== undefined;
