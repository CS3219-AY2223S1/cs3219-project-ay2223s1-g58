
export const STATUS_CODE_CREATED = 201
export const STATUS_CODE_SUCCESS = 200

export const STATUS_CODE_NOT_MODIFIED = 304
export const STATUS_CODE_CONFLICT = 409
export const STATUS_CODE_BAD_REQUEST = 400

// NODE_ENV is set automatically
// - === 'production when running npm run build
// - === 'development' when running npm run start

// Configure host and port
const HOST = process.env.REACT_APP_ENV === 'production' ? 'https://leetwithfriend.com' : 'http://localhost'

// USER SERVICE API
const URI_USER_SERVICE = `${HOST}${process.env.NODE_ENV === 'production' ? '' : ':8000'}`
const PREFIX_USER_SERVICE = '/api/v1/user'
export const URL_USER_SERVICE = URI_USER_SERVICE + PREFIX_USER_SERVICE
export const URL_USER_LOGIN = URL_USER_SERVICE + '/login'
export const URL_USER_LOGOUT = URL_USER_SERVICE + '/logout'
export const URL_USER_SIGNUP = URL_USER_SERVICE + '/signup'
export const URL_USER_TOKEN = URL_USER_SERVICE + '/token'
export const URL_USER_TOKEN_TEST = URL_USER_SERVICE + '/testToken'

// QUESTION SERVICE API

const URI_QUESTION_SERVICE = `${HOST}${process.env.NODE_ENV === 'production' ? '' : ':8500'}`
export const URL_QUESTION_SERVICE = URI_QUESTION_SERVICE + '/api/v1/question'
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

export const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/
export const EMAIL_REGEX = /^\S+@\S+\.\S+$/

export const URI_MATCHING_SERVICE = `${HOST}${process.env.NODE_ENV === 'production' ? '' : ':8001'}`
export const URI_MATCHING_SERVICE_SOCKET_PATH = '/socket.io/matching'
const PREFIX_MATCHING_SERVICE = '/api/v1/matching'
export const URL_MATCHING_SERVICE =
  URI_MATCHING_SERVICE + PREFIX_MATCHING_SERVICE

export const URI_ROOM_SERVICE = `${HOST}${process.env.NODE_ENV === 'production' ? '' : ':8022'}`
export const URI_ROOM_SERVICE_SOCKET_PATH = '/socket.io/room'
const PREFIX_ROOM_SERVICE = '/api/v1/room'
export const URL_ROOM_SERVICE = URI_ROOM_SERVICE + PREFIX_ROOM_SERVICE

const URI_HISTORY_SERVICE = `${HOST}${process.env.NODE_ENV === 'production' ? '' : ':8080'}`
const PREFIX_HISTORY_SERVICE = '/api/v1/history'
export const URL_HISTORY_USER =
  URI_HISTORY_SERVICE + PREFIX_HISTORY_SERVICE + '/user'
export const URL_HISTORY_ROOM =
  URI_HISTORY_SERVICE + PREFIX_HISTORY_SERVICE + '/room'

export const PEERJS_HOST =
  process.env.REACT_APP_ENV === 'production' ? 'leetwithfriend.com' : 'localhost'
export const PEERJS_PORT = process.env.REACT_APP_ENV === 'production' ? 443 : process.env.NODE_ENV === 'development' ? 9000 : 80
export const PEERJS_PATH = '/myapp'

export const EVENT_LISTEN = {
  MATCHING: 'matching',
  MATCH_SUCCESS: 'matchSuccess',
  MATCH_FAIL: 'matchFail',
  MATCH_TIMEOUT: 'matchTimeout',
  MATCH_UNAVAILABLE: 'matchUnavailable',
  ROOM_END: 'roomEnd',
  ROOM_UPDATE: 'roomUpdate',
}

export const EVENT_EMIT = {
  MATCH_FIND: 'matchFind',
  MATCH_CANCEL: 'matchCancel',
}

export const RANDOM_AVATAR_URL = 'https://avatars.dicebear.com/api/bottts/'

