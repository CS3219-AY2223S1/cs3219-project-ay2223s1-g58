const questionServiceFallback =
  process.env.ENV === 'production' // production means using Docker
    ? `http://${process.env.QUESTION_SERVICE_HOST}:8500`
    : 'http://localhost:8500'

const URI_QUESTION_SERVICE =
  process.env.URI_QUESTION_SERVICE || questionServiceFallback

const PREFIX_QUESTION_SERVICE = '/api/v1/question'

export const URL_QUESTION_SERVICE_QUESTION_NAMES =
  URI_QUESTION_SERVICE + PREFIX_QUESTION_SERVICE + '/questionNames'
