const MatchService = require("../service/match-service");
const { sendMessageToBoth, isSocketActive } = require("../utils/socket-io");
const { EVENTS } = require("../const/constants");

async function findMatch(payload) {
  const socket = this;
  try {
    // finds same difficulty excluding same socketId
    // TODO add validation for payload
    const match = await MatchService.findByDifficulty(
      payload.difficulty,
      socket.id
    );
    // no other user with same requirements ready for match, or other user is not active
    if (!match || !isSocketActive(match.socketId)) {
      // matched but socket inactive
      if (match) {
        console.log("Inactive user found");
        MatchService.deleteMatch(match.socketId);
      }
      await MatchService.createMatch(socket.id, payload.difficulty);
      socket.emit(EVENTS.MATCHING, {
        status: EVENTS.MATCHING,
      });
      return;
    }
    // TODO additional validations
    MatchService.deleteMatch(match.socketId);
    sendMessageToBoth(match.socketId, socket.id, EVENTS.MATCH_SUCCESS, {
      status: EVENTS.MATCH_SUCCESS,
      room: `${match.socketId}|${socket.id}`,
    });
  } catch (e) {
    // TODO add custom error messages
    socket.emit(EVENTS.MATCH_FAIL, {
      status: EVENTS.MATCH_FAIL,
      error: e.message,
    });
  }
}

module.exports = findMatch;
