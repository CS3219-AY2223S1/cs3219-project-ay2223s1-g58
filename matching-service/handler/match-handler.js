const MatchRepository = require("../repository/match-repository");
const { sendMessage } = require("../utils/socket-io");

async function findMatch(payload) {
  const socket = this;
  try {
    // finds same difficulty excluding same socketId
    // TODO add validation for payload
    const matchResult = await MatchRepository.findByDifficulty(
      payload.difficulty,
      socket.id
    );
    // no other user with same requirements ready for match
    if (matchResult.length === 0) {
      await MatchRepository.create(socket.id, payload.difficulty);
      socket.emit("matching", {
        status: "matching",
      });
      return;
    }
    const match = matchResult[0];
    // TODO check that both sockets are still open
    // TODO additional validations
    await MatchRepository.delete(match.socketId);
    sendMessage(match.socketId, socket.id, "matchSuccess", {
      status: "matchSuccess",
      room: `${match.socketId}|${socket.id}`,
    });
  } catch (e) {
    // TODO add custom error messages
    socket.emit("matchFail", {
      status: "matchFail",
      error: e.message,
    });
  }
}

module.exports = findMatch;
