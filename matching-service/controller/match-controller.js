const axios = require("axios").default;
const MatchService = require("../service/match-service");
const { isSocketActive } = require("../utils/socket-io");
const {
  EVENT_EMIT,
  STATUS_CODE_BAD_REQUEST,
  URL_QUESTION_SERVICE,
} = require("../const/constants");
const { matchDto } = require("../dto/match-dto");

exports.findMatch = async function (payload) {
  const socket = this;
  try {
    const { value, error } = matchDto.validate(payload);
    if (error) {
      throw error;
    }

    await axios
      .get(URL_QUESTION_SERVICE, {
        params: { difficulty: value.difficulty, types: value.types },
      })
      .catch((e) => {
        if (e.response.status === STATUS_CODE_BAD_REQUEST) {
          socket.emit(EVENT_EMIT.MATCH_UNAVAILABLE, {
            status: EVENT_EMIT.MATCH_UNAVAILABLE,
          });
        }
      });

    const match = await MatchService.findByDifficulty(
      value.difficulty,
      value.types,
      socket.id
    );

    // no other user with same requirements ready for match, or other user is not active
    if (!match) {
      await MatchService.createMatch(
        socket.id,
        value.difficulty,
        value.types,
        socket.userId
      );
      console.log(EVENT_EMIT.MATCHING);
      socket.emit(EVENT_EMIT.MATCHING, {
        status: EVENT_EMIT.MATCHING,
      });
      return;
    }

    // Retrieve available type
    const types = match.types ? match.types : value.types;

    // TODO additional validations
    await MatchService.matchSuccess(
      match.socketId,
      match.userId,
      socket.id,
      socket.userId,
      value.difficulty,
      types
    );
  } catch (e) {
    // TODO add custom error messages
    console.error(e);
    console.log(EVENT_EMIT.MATCH_FAIL);

    if (e.response.status === STATUS_CODE_BAD_REQUEST) {
      socket.emit(EVENT_EMIT.MATCH_UNAVAILABLE, {
        status: EVENT_EMIT.MATCH_UNAVAILABLE,
      });
    } else {
      socket.emit(EVENT_EMIT.MATCH_FAIL, {
        status: EVENT_EMIT.MATCH_FAIL,
        error: e.message,
      });
    }
  }
};

exports.cancelMatch = async function () {
  const socket = this;
  console.log("Cancel Match");
  MatchService.deleteMatch(socket.id);
};
