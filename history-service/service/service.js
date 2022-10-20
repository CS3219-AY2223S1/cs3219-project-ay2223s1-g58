import HistoryRepository from '../repository/repository.js'
import { URL_QUESTION_SERVICE_QUESTION_NAMES } from '../constants/const.js'
import axios from 'axios'

const HistoryService = {
  /** Returns an array of questions the user has completed, including questions from any current room. */
  getUserHistory: async function (uid) {
    const resp = await HistoryRepository.getByUid(uid).lean() // an array of rooms
    if (resp.length === 0) {
      return []
    }
    const questions = flattenHist(uid, resp)
    const params = getIdParams(questions)

    const res = await axios
      .get(URL_QUESTION_SERVICE_QUESTION_NAMES, { params: params })
      .catch(console.log)
    // insert question name into the response
    questions.forEach((q) => q.name = res.data.data[q.id])
    questions.sort((x, y) => new Date(y.completedAt) - new Date(x.completedAt))
    return questions
  },
  /** Creates a new room for History purposes. To be called when the room is created by Matching service. */
  createRoomHistory: async function (roomId, u1, u2) {
    return HistoryRepository.create(roomId, u1, u2)
  },
  /** Adds a completed question to this room. Also records the final answer when the question was completed. */
  updateRoomHistory: async function (roomId, questionId, answer) {
    if (!answer) {
      answer = ''
    }
    return HistoryRepository.add(roomId, questionId, answer)
  },
}

/**
 * Data is a list of room documents; within each room is a list of question documents.
 * We flatten it into a list of question objects, where each question consists of a partner,
 * question details, and a key property for React child.
 */
function flattenHist(uid, data) {
  return data.flatMap((room) => {
    const partner = room.u1 === uid ? room.u2 : room.u1
    function transformer(question) {
      return {
        partner,
        roomId: room.roomId,
        ...question,
      }
    }
    return room.completed.map(transformer)
  })
}

/** Constructs a query param string consisting of the question IDs. */
function getIdParams(questions) {
  const ids = new Set(questions.map((q) => {
    return q.id
  }))
  const params = new URLSearchParams()
  ids.forEach((id) => params.append('id', id))
  return params
}

export default HistoryService
