const axios = require("axios").default;
const RoomRepository = require("../repository/room-repository");
const { emit } = require("../utils/socket-io");
const {
  EVENT_EMIT,
  URL_QUESTION_SERVICE,
  URL_QUESTION_SERVICE_NEXT_QUESTION,
} = require("../const/constants");
const { setBetween } = require("../utils/common");

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
      [response.data.id],
      userId1,
      userId2,
      difficulty,
      0
    );
  },
  updateRoomQuestionIds: async function (roomId, change) {
    const room = await RoomRepository.findByRoomId(roomId);
    const updatedCurrent = setBetween(
      room.current + change,
      room.questionIds.length,
      0
    );

    let updatedQuestionId = room.questionIds;

    if (updatedCurrent >= room.questionIds.length) {
      const response = await axios.get(URL_QUESTION_SERVICE_NEXT_QUESTION, {
        params: { difficulty: room.difficulty, past_id: room.questionIds },
      });
      console.log("response", response);
      updatedQuestionId = [...room.questionIds, response.data.id];
      console.log("updatedQuestionId", updatedQuestionId);
    }

    console.log("Updated room", {
      ...room,
      current: updatedCurrent,
      questionIds: updatedQuestionId,
    });

    RoomRepository.update(roomId, {
      ...room,
      current: updatedCurrent,
      questionIds: updatedQuestionId,
    });

    emit(`${roomId}-${EVENT_EMIT.ROOM_UPDATE}`, {
      status: EVENT_EMIT.ROOM_UPDATE,
      room: roomId,
      question: updatedQuestionId[updatedCurrent],
      isFirst: updatedCurrent === 0,
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
