import UserModel from "./user-model.js"
import mongoose from "mongoose"
import "dotenv/config"

let mongoDB =
    process.env.ENV == "PROD"
        ? process.env.DB_CLOUD_URI
        : process.env.DB_LOCAL_URI // Either via docker-compose, or local mongo db needed

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

let db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

export async function createUser(params) {
    return new UserModel(params)
}

export async function doesUserExist(username) {
    return UserModel.exists({ username: username })
}

export async function getUser(username) {
    return UserModel.findOne({ username: username })
}
