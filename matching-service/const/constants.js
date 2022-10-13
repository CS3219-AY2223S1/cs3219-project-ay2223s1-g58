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

const historyServiceFallback =
  process.env.ENV === "production"
    ? `http://${process.env.HISTORY_SERVICE_HOST}:8080`
    : "http://localhost:8080";
const URI_HISTORY_SERVICE =
  process.env.URI_HISTORY_SERVICE || historyServiceFallback;
const HISTORY_SERVICE_ROOM_PATH = "/api/v1/history/room";

exports.URL_HISTORY_SERVICE_ROOM_PATH =
  URI_HISTORY_SERVICE + HISTORY_SERVICE_ROOM_PATH;
