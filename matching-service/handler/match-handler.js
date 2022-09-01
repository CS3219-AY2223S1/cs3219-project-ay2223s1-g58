import MatchRepository from "../repository/match-repository";

async function findMatch(payload, callback) {
  const socket = this;
  try {
    const match = MatchRepository.findByDifficulty(payload.difficulty);
    if (!match) {
      MatchRepository.create(payload.id, payload.difficulty);
      return callback({
        status: "matching",
      });
    }
    // TODO check that both sockets are still open
    // TODO generate room id
    MatchRepository.delete(payload.id);
    return callback({
      room: 1,
    });
  } catch (e) {
    return callback({
      error: e,
    });
  }
}

export default findMatch;
