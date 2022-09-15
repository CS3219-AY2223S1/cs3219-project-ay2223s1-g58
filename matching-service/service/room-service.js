const RoomRepository = require("../repository/room-repository");
const { sendMessageToTwo } = require("../utils/socket-io");
const { EVENT_EMIT } = require("../const/constants");

const RoomService = {
  findByRoomId: function (roomId) {
    return RoomRepository.findByRoomId(roomId);
  },
  createRoom: function (roomId, questionId) {
    return RoomRepository.create(roomId, questionId);
  },
  deleteRoom: function (roomId) {
    const socketIds = roomId.split("|");
    if (socketIds.length !== 2) {
      throw new Error("Invalid roomId");
    }
    sendMessageToTwo(socketIds[0], socketIds[1], EVENT_EMIT.ROOM_END, {
      status: EVENT_EMIT.ROOM_END,
      room: roomId,
    });
    // TODO add to match history
    return RoomRepository.delete(roomId);
  },
};

module.exports = RoomService;
