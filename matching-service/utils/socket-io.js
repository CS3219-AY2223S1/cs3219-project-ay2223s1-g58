const { Server } = require("socket.io");

let io;
exports.initSocket = (httpServer, matchHandler) => {
  io = new Server(httpServer);
  io.on("connection", (socket) => {
    socket.on("match", matchHandler);
  });
};

exports.sendMessage = (firstSocket, secondSocket, event, message) =>
  io.to(firstSocket).to(secondSocket).emit(event, message);
