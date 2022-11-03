import mongoose from 'mongoose'

var Schema = mongoose.Schema

const CompletedQuestionSchema = new Schema({
  id: {
    type: String,
    immutable: true,
  },
  answer: {
    type: String,
    immutable: true,
  },
  completedAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
})

const HistoryModelSchema = new Schema(
  {
    roomId: {
      type: String,
      unique: true,
      immutable: true,
    },
    u1: {
      type: String,
      immutable: true,
    },
    u2: {
      type: String,
      immutable: true,
    },
    // Array of nested sub-documents 
    completed: [CompletedQuestionSchema],
  },
  // Schema options to enable createdAt and updatedAt timestamps
  {
    timestamps: true,
  }
)

export default mongoose.model('History', HistoryModelSchema)
