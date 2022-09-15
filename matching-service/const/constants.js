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

const BASE_URL_QUESTION_SERVICE =
  process.env.URL_USER_SERVICE || "http://localhost:8500";
const PREFIX_QUESTION_SERVICE = "/api/v1/question";

const URL_QUESTION_SERVICE =
  BASE_URL_QUESTION_SERVICE + PREFIX_QUESTION_SERVICE;

exports.URL_QUESTION_DIFFICULTY = `${URL_QUESTION_SERVICE}/difficulty`;
