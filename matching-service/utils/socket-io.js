const { Server } = require("socket.io");

let io;
exports.initSocket = (httpServer, matchHandler) => {
  io = new Server(httpServer);
  io.on("connection", (socket) => {
    socket.on("match", matchHandler);
  });
};

exports.sendMessageToBoth = (firstSocket, secondSocket, event, message) =>
  io.to(firstSocket).to(secondSocket).emit(event, message);

exports.sendMessageToOne = (socket, event, message) =>
  io.to(socket).emit(event, message);

exports.isSocketActive = (socket) => {
  const socketList = io.sockets.server.eio.clients;
  return socketList[socket] !== undefined;
};
