const RoomRepository = require("../repository/room-repository");
const { emit } = require("../utils/socket-io");
const { EVENT_EMIT } = require("../const/constants");

const RoomService = {
  findByRoomId: function (roomId) {
    return RoomRepository.findByRoomId(roomId);
  },
  createRoom: function (roomId, questionId, userId1, userId2) {
    return RoomRepository.create(roomId, questionId, userId1, userId2);
  },
  deleteRoom: function (roomId) {
    emit(`${roomId}-${EVENT_EMIT.ROOM_END}`, {
      status: EVENT_EMIT.ROOM_END,
      room: roomId,
    });
    // TODO add to match history
    return RoomRepository.delete(roomId);
  },
};

module.exports = RoomService;
