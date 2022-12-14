import mongoose from 'mongoose'
import HistoryModel from '../model/history.js'
import 'dotenv/config'

const uri = process.env.ENV == "production"
  ? process.env.DB_MONGO_URI
  : "mongodb://mongo:27017/peerprep"

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => console.error('MongoDB connection error'))
db.on('connected', () => console.info('Connected to MongoDB'))

const HistoryRepository = {
  /** Returns an array of rooms the user has been in. */
  getByUid: function (uid) {
    return HistoryModel.find({ $or: [{ u1: uid }, { u2: uid }] })
  },
  /** Creates a new room for History service. Returns an error if roomId already exists. */
  create: async function (roomId, u1, u2) {
    if (await HistoryModel.exists({ roomId: roomId })) {
      return { err: 'roomId already exists' }
    }
    try {
      await HistoryModel.create({ roomId, u1, u2 })
    } catch (err) {
      return { err }
    }
  },
  /** Adds a completed question and its answer to the room history. Returns an error if roomId does not exist. */
  add: async function (roomId, questionId, answer) {
    const doc = await HistoryModel.findOneAndUpdate(
      { roomId: roomId },
      {
        $push: {
          'completed': { id: questionId, answer: answer },
        }
      },
      { new: true }
    )
    if (!doc) {
      return { err: 'roomId does not exist' }
    }
  },
  /** Deletes all history of room if exists. */
  delete: function (roomId) {
    return HistoryModel.deleteOne({ roomId: roomId })
  }
}

export default HistoryRepository
