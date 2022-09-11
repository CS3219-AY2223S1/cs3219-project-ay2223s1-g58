const schedule = require("node-schedule");
const MatchRepository = require("../repository/match-repository");
const { sendMessageToOne } = require("../utils/socket-io");
const { EVENTS } = require("../const/constants");

const MATCH_TIMEOUT_SECONDS = 30;
const MATCH_TIMEOUT = MATCH_TIMEOUT_SECONDS * 1000;

const scheduleTimeout = (socketId) => {
  const date = new Date();
  schedule.scheduleJob(new Date(date.getTime() + MATCH_TIMEOUT), async () => {
    if (await MatchRepository.findBySocketId(socketId)) {
      MatchRepository.delete(socketId);
      sendMessageToOne(
        socketId,
        EVENTS.MATCH_TIMEOUT,
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
};

module.exports = MatchService;
