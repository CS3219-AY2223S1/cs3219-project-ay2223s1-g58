import HistoryRepository from '../repository/repository.js'

const HistoryService = {
  getUserHistory: async function (uid) {
    return HistoryRepository.getByUid(uid)
  },
  addRoomHistory: async function (roomId, questionId, answer) {
    if (!answer) {
      answer = ''
    }
    return HistoryRepository.create({ roomId, questionId, answer })
  },
}

export default HistoryService
