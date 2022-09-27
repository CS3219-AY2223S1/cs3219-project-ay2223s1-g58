const schedule = require("node-schedule");
const axios = require("axios").default;

axios.defaults.withCredentials = true;

const MatchRepository = require("../repository/match-repository");
const { sendMessageToOne, sendMessageToBoth } = require("../utils/socket-io");
const { EVENT_EMIT, URL_QUESTION_SERVICE } = require("../const/constants");
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
  matchSuccess: async function (socketIdWaiting, socketIdNew, difficulty) {
    await MatchService.deleteMatch(socketIdWaiting);
    console.log(EVENT_EMIT.MATCH_SUCCESS);
    const roomId = `${socketIdWaiting}|${socketIdNew}`;
    // const response = await axios.get(URL_QUESTION_SERVICE, {
    //   params: { difficulty: difficulty },
    // });
    await RoomService.createRoom(roomId, "1"); // response.data.id);
    sendMessageToBoth(socketIdWaiting, socketIdNew, EVENT_EMIT.MATCH_SUCCESS, {
      status: EVENT_EMIT.MATCH_SUCCESS,
      room: roomId,
    });
  },
};

module.exports = MatchService;
