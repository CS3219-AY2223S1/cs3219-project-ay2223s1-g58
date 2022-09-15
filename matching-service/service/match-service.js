const schedule = require("node-schedule");
const axios = require("axios").default;

const MatchRepository = require("../repository/match-repository");
const { sendMessageToOne, sendMessageToBoth } = require("../utils/socket-io");
const { EVENT_EMIT, URL_QUESTION_DIFFICULTY } = require("../const/constants");
const RoomService = require("./room-service");

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
  createMatch: async function (socketId, difficulty) {
    const created = await MatchRepository.create(socketId, difficulty);
    scheduleTimeout(socketId);
    return created;
  },
  deleteMatch: function (socketId) {
    return MatchRepository.delete(socketId);
  },
  matchSuccess: async function (sockerIdWaiting, socketIdNew, difficulty) {
    await MatchService.deleteMatch(sockerIdWaiting);
    console.log(EVENT_EMIT.MATCH_SUCCESS);
    const roomId = `${sockerIdWaiting}|${socketIdNew}`;
    // const response = await axios.get({
    //   baseURL: URL_QUESTION_DIFFICULTY,
    //   data: { difficulty: difficulty },
    // });
    // Currently question service cannot be run, so this will be a placeholder
    const response = { id: Math.floor(Math.random() * 100) };
    await RoomService.createRoom(roomId, response.id);
    sendMessageToBoth(sockerIdWaiting, socketIdNew, EVENT_EMIT.MATCH_SUCCESS, {
      status: EVENT_EMIT.MATCH_SUCCESS,
      room: roomId,
    });
  },
};

module.exports = MatchService;
