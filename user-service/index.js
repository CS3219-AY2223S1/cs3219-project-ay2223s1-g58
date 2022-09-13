import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"
import compression from "compression"
import redis from "redis"
import "dotenv/config"

import {
    createUser,
    deleteUser,
    getUser,
    login,
    logout,
    token,
    updateUser
} from "./controller/user-controller.js"
import { authenticateToken } from './middleware.js'
import logger from './logger.js'
import { seedUsers } from "./model/repository.js"

const API_PREFIX = "/api/v1/user"

const app = express()
const router = express.Router()

let redisClient

(async () => {
    redisClient = redis.createClient({ url: `redis://${process.env.REDIS_HOST}:6379` });
    redisClient.on("error", (error) => logger.error(`${error}`))
    redisClient.on("connect", () => logger.info("Connected to Redis"))
    await redisClient.connect()
})()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

app.use(API_PREFIX, router).all((_, res) => {
    res.setHeader("content-type", "application/json")
    res.setHeader("Access-Control-Allow-Origin", "*")
})

// CHECK SERVER ALIVE
router.get("/status", (_, res) => {
    res.status(200).send({ message: "Hello World from user-service" })
})

// CREATE USER
router.post("/", createUser)
// LOGIN
router.post("/login", login)
// REFRESH TOKEN
router.post('/token', token)
// UPDATE USER
router.put("/", authenticateToken, updateUser)
// GET USER
router.get("/", authenticateToken, getUser)
// DELETE USER
router.delete("/", authenticateToken, deleteUser)
// LOGOUT
router.post('/logout', authenticateToken, logout)

// TEST TOKEN
router.post("/testToken", authenticateToken, (req, res) => {
    console.log(req)
    res.status(200).send("Hello World from user-service token test")
})

// Error handling
app.use((err, _, res, next) => {
    logger.error(err)
    res.status(500).send({ message: "Server error" })
    next(err);
})

app.listen(8000, async () => {
    try {
        await seedUsers()
    } catch {
        logger.info("Seeded in the past")
    }
    logger.info("user-service listening on port 8000")
})

export { redisClient, app }