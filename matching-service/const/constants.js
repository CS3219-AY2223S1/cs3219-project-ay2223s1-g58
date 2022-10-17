exports.EVENT_EMIT = {
  MATCHING: "matching",
  MATCH_SUCCESS: "matchSuccess",
  MATCH_FAIL: "matchFail",
  MATCH_TIMEOUT: "matchTimeout",
};

exports.EVENT_LISTEN = {
  MATCH_FIND: "matchFind",
  MATCH_CANCEL: "matchCancel",
};

exports.DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

const questionServiceFallback =
  process.env.ENV === "production" // production means using Docker
    ? `http://${process.env.QUESTION_SERVICE_HOST}:8500`
    : "http://localhost:8500";

const URI_QUESTION_SERVICE =
  process.env.URI_QUESTION_SERVICE || questionServiceFallback;

const PREFIX_QUESTION_SERVICE = "/api/v1/question";

exports.URL_QUESTION_SERVICE = URI_QUESTION_SERVICE + PREFIX_QUESTION_SERVICE;

const roomServiceFallback =
  process.env.ENV === "production" // production means using Docker
    ? `http://${process.env.ROOM_SERVICE_HOST}:8022`
    : "http://localhost:8022";

const URI_ROOM_SERVICE = process.env.URI_ROOM_SERVICE || roomServiceFallback;

const PREFIX_ROOM_SERVICE = "/api/v1/room";

exports.URL_ROOM_SERVICE = URI_ROOM_SERVICE + PREFIX_ROOM_SERVICE;
