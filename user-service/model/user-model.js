import mongoose from 'mongoose'

var Schema = mongoose.Schema
let UserModelSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: 1,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
})

UserModelSchema.pre('save', function (next) {
    this.updatedAt = Date.now()
    next()
})

export default mongoose.model('UserModel', UserModelSchema)
