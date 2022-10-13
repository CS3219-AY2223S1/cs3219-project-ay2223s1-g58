const schedule = require("node-schedule");
const axios = require("axios").default;

axios.defaults.withCredentials = true;

const MatchRepository = require("../repository/match-repository");
const { sendMessageToOne, sendMessageToBoth } = require("../utils/socket-io");
const {
  EVENT_EMIT,
  URL_QUESTION_SERVICE,
  URL_ROOM_SERVICE,
} = require("../const/constants");

const MATCH_TIMEOUT_SECONDS = 30;
const MATCH_TIMEOUT = MATCH_TIMEOUT_SECONDS * 1000;

const scheduleTimeout = (socketId) => {
  const date = new Date();
  schedule.scheduleJob(new Date(date.getTime() + MATCH_TIMEOUT), async () => {
    if (await MatchRepository.findBySocketId(socketId)) {
      MatchRepository.delete(socketId);
      console.log(EVENT_EMIT.MATCH_TIMEOUT);
      sendMessageToOne(
        socketId,
        EVENT_EMIT.MATCH_TIMEOUT,
        `Match timeout after ${MATCH_TIMEOUT_SECONDS}s`
      );
    }
  });
};

const MatchService = {
  findByDifficulty: function (difficulty, socketId) {
    return MatchRepository.findByDifficulty(difficulty, socketId);
  },
  createMatch: async function (socketId, difficulty, userId) {
    const created = await MatchRepository.create(socketId, difficulty, userId);
    scheduleTimeout(socketId);
    return created;
  },
  deleteMatch: function (socketId) {
    return MatchRepository.delete(socketId);
  },
  matchSuccess: async function (
    socketIdWaiting,
    userWaiting,
    socketIdNew,
    userNew,
    difficulty
  ) {
    await MatchService.deleteMatch(socketIdWaiting);
    console.log(EVENT_EMIT.MATCH_SUCCESS);
    const roomId = `${socketIdWaiting}-${socketIdNew}`;
    const response = await axios.get(URL_QUESTION_SERVICE, {
      params: { difficulty: difficulty },
    });
    await axios.post(URL_ROOM_SERVICE, {
      roomId,
      questionId: response.data.id,
      userId1: userWaiting,
      userId2: userNew,
      difficulty,
    });
    console.log(`Created room ${roomId} for ${userWaiting} and ${userNew}`);
    sendMessageToBoth(socketIdWaiting, socketIdNew, EVENT_EMIT.MATCH_SUCCESS, {
      status: EVENT_EMIT.MATCH_SUCCESS,
      room: roomId,
    });
  },
};

module.exports = MatchService;
