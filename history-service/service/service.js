import HistoryRepository from '../repository/repository.js'

const HistoryService = {
  /** Returns an array of rooms the user has been in, including any current room. */
  getUserHistory: async function (uid) {
    return HistoryRepository.getByUid(uid)
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

export default HistoryService
