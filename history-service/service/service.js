import HistoryRepository from '../repository/repository.js'
// import axios from 'axios'
// axios.defaults.withCredentials = true;

const HistoryService = {
  /** Returns an array of rooms the user has been in, including any current room. */
  getUserHistory: async function (uid) {
    return HistoryRepository.getByUid(uid)
  },
  /** Creates a new room for History purposes. To be called when the room is created by Matching service. */
  createRoomHistory: async function (roomId) {
    // TODO fetch u1, u2 from Matching Service
    // const response = await axios.get(`${URL_MATCHING_SERVICE}/room/${roomId}`);
    // const { u1, u2 } = response.data
    const u1 = 'qwe'
    const u2 = Math.random() < 0.5 ? 'asd' : 'zxc'
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
