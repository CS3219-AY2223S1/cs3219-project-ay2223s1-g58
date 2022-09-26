exports.EVENT_EMIT = {
  MATCHING: "matching",
  MATCH_SUCCESS: "matchSuccess",
  MATCH_FAIL: "matchFail",
  MATCH_TIMEOUT: "matchTimeout",
  ROOM_END: "roomEnd",
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
