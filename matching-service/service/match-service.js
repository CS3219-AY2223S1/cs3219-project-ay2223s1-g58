const schedule = require("node-schedule");
const axios = require("axios").default;
const nanoid = require("nanoid");

const MatchRepository = require("../repository/match-repository");
const { sendMessageToOne, sendMessageToBoth } = require("../utils/socket-io");
const { EVENT_EMIT, URL_ROOM_SERVICE } = require("../const/constants");

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
  findByDifficulty: function (difficulty, types, socketId) {
    if (types) {
      return MatchRepository.findByTypesAndDifficulty(difficulty, types, socketId);
    }
    return MatchRepository.findByDifficulty(difficulty, socketId);
  },
  createMatch: async function (socketId, difficulty, types, userId) {
    const created = await MatchRepository.create(socketId, difficulty, types, userId);
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
    difficulty,
    types
  ) {
    await MatchService.deleteMatch(socketIdWaiting);
    console.log(EVENT_EMIT.MATCH_SUCCESS);
    const roomId = nanoid(7) + new Date().getTime();
    await axios.post(URL_ROOM_SERVICE, {
      roomId,
      userId1: userWaiting,
      userId2: userNew,
      difficulty,
      types: types
    });
    console.log(`Created room ${roomId} for ${userWaiting} and ${userNew}`);
    sendMessageToBoth(socketIdWaiting, socketIdNew, EVENT_EMIT.MATCH_SUCCESS, {
      status: EVENT_EMIT.MATCH_SUCCESS,
      room: roomId,
    });
  },
};

module.exports = MatchService;
