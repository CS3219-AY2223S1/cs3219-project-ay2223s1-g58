const axios = require("axios").default;
const RoomRepository = require("../repository/room-repository");
const { emit } = require("../utils/socket-io");
const {
  EVENT_EMIT,
  URL_QUESTION_SERVICE,
  URL_QUESTION_SERVICE_NEXT_QUESTION,
} = require("../const/constants");

const RoomService = {
  findByRoomId: function (roomId) {
    return RoomRepository.findByRoomId(roomId);
  },
  findByUserId: function (userId) {
    return RoomRepository.findByUserId(userId);
  },
  createRoom: async function (roomId, userId1, userId2, difficulty, types) {
    const response = await axios.get(URL_QUESTION_SERVICE, {
      params: { difficulty: difficulty, types: types },
    });
    return RoomRepository.create(
      roomId,
      response.data.id,
      userId1,
      userId2,
      difficulty,
    );
  },
  updateRoomQuestionId: async function (roomId) {
    const room = await RoomRepository.findByRoomId(roomId);
    console.log(room);
    const response = await axios.get(URL_QUESTION_SERVICE_NEXT_QUESTION, {
      params: { difficulty: room.difficulty, past_id: room.questionId },
    });
    // TODO append it to array instead of replacing when update to Postgres
    RoomRepository.update(roomId, { ...room, questionId: response.data.id });
    emit(`${roomId}-${EVENT_EMIT.ROOM_UPDATE}`, {
      status: EVENT_EMIT.ROOM_UPDATE,
      room: roomId,
      question: response.data.id,
    });
  },
  deleteRoom: function (roomId) {
    emit(`${roomId}-${EVENT_EMIT.ROOM_END}`, {
      status: EVENT_EMIT.ROOM_END,
      room: roomId,
    });
    return RoomRepository.delete(roomId);
  },
};

module.exports = RoomService;
