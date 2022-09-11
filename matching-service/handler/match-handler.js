const MatchService = require("../service/match-service");
const { sendMessageToBoth, isSocketActive } = require("../utils/socket-io");
const { EVENTS } = require("../const/constants");
const { matchDto } = require("../dto/match-dto");

async function findMatch(payload) {
  const socket = this;
  try {
    const { value, error } = matchDto.validate(payload);
    if (error) {
      throw error;
    }
    const match = await MatchService.findByDifficulty(
      value.difficulty,
      socket.id
    );
    // no other user with same requirements ready for match, or other user is not active
    if (!match || !isSocketActive(match.socketId)) {
      // matched but socket inactive
      if (match) {
        console.log("Inactive user found");
        MatchService.deleteMatch(match.socketId);
      }
      await MatchService.createMatch(socket.id, value.difficulty);
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
