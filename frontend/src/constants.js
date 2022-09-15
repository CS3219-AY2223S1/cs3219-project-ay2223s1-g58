export const STATUS_CODE_CREATED = 201
export const STATUS_CODE_SUCCESS = 200
export const STATUS_CODE_CONFLICT = 409
export const STATUS_CODE_BAD_REQUEST = 400

// USER SERVICE API
const BASE_URL_USER_SERVICE =
  process.env.URL_USER_SERVICE || 'http://localhost:8000'
const PREFIX_USER_SERVICE = '/api/v1/user'
export const URL_USER_SERVICE = BASE_URL_USER_SERVICE + PREFIX_USER_SERVICE
export const URL_USER_LOGIN = URL_USER_SERVICE + '/login'
export const URL_USER_LOGOUT = URL_USER_SERVICE + '/logout'
export const URL_USER_SIGNUP = URL_USER_SERVICE + '/signup'
export const URL_USER_TOKEN = URL_USER_SERVICE + '/token'
export const URL_USER_TOKEN_TEST = URL_USER_SERVICE + '/testToken'

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
export const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/
export const EMAIL_REGEX = /^\S+@\S+\.\S+$/

export const BASE_URL_MATCHING_SERVICE =
  process.env.URL_MATCHING_SERVICE || 'http://localhost:8001'

const PREFIX_MATCHING_SERVICE = '/api/v1/matching'
export const URL_MATCHING_SERVICE =
  BASE_URL_MATCHING_SERVICE + PREFIX_MATCHING_SERVICE
export const URL_MATCHING_ROOM = URL_MATCHING_SERVICE + '/room'

export const EVENT_LISTEN = {
  MATCHING: 'matching',
  MATCH_SUCCESS: 'matchSuccess',
  MATCH_FAIL: 'matchFail',
  MATCH_TIMEOUT: 'matchTimeout',
}

export const EVENT_EMIT = {
  MATCH_FIND: 'matchFind',
  MATCH_CANCEL: 'matchCancel',
}

export const RANDOM_AVATAR_URL = 'https://avatars.dicebear.com/api/bottts/'
