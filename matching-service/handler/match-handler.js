const MatchRepository = require("../repository/match-repository.js");
const { sendMessage } = require("../utils/socket-io.js");

async function findMatch(payload) {
  const socket = this;
  try {
    const json = JSON.parse(payload);
    // finds same difficulty excluding same socketId
    const matchResult = await MatchRepository.findByDifficulty(
      json.difficulty,
      socket.id
    );
    // no other user with same requirements ready for match
    if (matchResult.length === 0) {
      await MatchRepository.create(socket.id, json.difficulty);
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
    socket.emit("matchFail", {
      status: "matchFail",
      error: e.message,
    });
  }
}

module.exports = findMatch;
