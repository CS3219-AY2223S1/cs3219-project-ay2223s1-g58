const MatchRepository = require("../repository/match-repository.js");
const { sendMessage } = require("../utils/socket-io.js");

async function findMatch(payload) {
  const socket = this;
  try {
    const json = JSON.parse(payload);
    const matchResult = await MatchRepository.findByDifficulty(json.difficulty);
    console.log("found repo");
    console.log(matchResult);
    if (matchResult.length === 0) {
      MatchRepository.create(socket.id, json.difficulty);
      socket.emit("matching", {
        status: "matching",
      });
      return;
    }
    const match = matchResult[0];
    // TODO check that both sockets are still open
    // TODO additional validations
    MatchRepository.delete(match.socketId);
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
