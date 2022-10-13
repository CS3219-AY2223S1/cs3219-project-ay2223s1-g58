const axios = require("axios").default;
const RoomRepository = require("../repository/room-repository");
const { emit } = require("../utils/socket-io");
const { EVENT_EMIT, URL_QUESTION_SERVICE } = require("../const/constants");

const RoomService = {
  findByRoomId: function (roomId) {
    return RoomRepository.findByRoomId(roomId);
  },
  createRoom: async function (
    roomId,
    questionId,
    userId1,
    userId2,
    difficulty
  ) {
    const response = await axios.get(URL_QUESTION_SERVICE, {
      params: { difficulty: difficulty },
    });
    return RoomRepository.create(
      roomId,
      response.data.id,
      userId1,
      userId2,
      difficulty
    );
  },
  updateRoomQuestionId: async function (roomId) {
    const room = RoomRepository.findByRoomId(roomId);
    const response = await axios.get(URL_QUESTION_SERVICE, {
      params: { difficulty: room.difficulty, past_id: room.questionId },
    });
    // TODO append it to array instead of replacing when update to Postgres
    return RoomRepository.update({ ...room, questionId: response.data.id });
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
