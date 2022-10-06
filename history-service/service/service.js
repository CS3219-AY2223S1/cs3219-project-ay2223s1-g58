import HistoryRepository from '../repository/repository.js'

const HistoryService = {
  getUserHistory: async function (uid) {
    return HistoryRepository.getByUid(uid)
  },
  createRoomHistory: async function (roomId) {
    // TODO fetch u1, u2 from Matching Service
    const u1 = 'qwe'
    const u2 = Math.random() < 0.5 ? 'asd' : 'zxc'
    return HistoryRepository.create(roomId, u1, u2)
  },
  updateRoomHistory: async function (roomId, questionId, answer) {
    if (!answer) {
      answer = ''
    }
    return HistoryRepository.add(roomId, questionId, answer)
  },
}

export default HistoryService
