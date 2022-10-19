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

const roomServiceFallback =
  process.env.ENV === "production" // production means using Docker
    ? `http://${process.env.ROOM_SERVICE_HOST}:8022`
    : "http://localhost:8022";

const URI_ROOM_SERVICE = process.env.URI_ROOM_SERVICE || roomServiceFallback;

const PREFIX_ROOM_SERVICE = "/api/v1/room";

exports.URL_ROOM_SERVICE = URI_ROOM_SERVICE + PREFIX_ROOM_SERVICE;

const historyServiceFallback =
  process.env.ENV === "production"
    ? `http://${process.env.HISTORY_SERVICE_HOST}:8080`
    : "http://localhost:8080";
const URI_HISTORY_SERVICE =
  process.env.URI_HISTORY_SERVICE || historyServiceFallback;
const HISTORY_SERVICE_ROOM_PATH = "/api/v1/history/room";

exports.URL_HISTORY_SERVICE_ROOM_PATH =
  URI_HISTORY_SERVICE + HISTORY_SERVICE_ROOM_PATH;
