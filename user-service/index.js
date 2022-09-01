import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"
import compression from "compression"
import redis from "redis"
import { createUser, login, logout, token } from "./controller/user-controller.js"
import { authenticateToken } from './middleware.js'
import "dotenv/config"

const app = express()
const router = express.Router()

let redisClient

(async () => {
    redisClient = redis.createClient({ url: `redis://${process.env.REDIS_HOST}:6379` });
    redisClient.on("error", (error) => console.error(`Error: ${error}`))
    await redisClient.connect()
    console.log("Connected to Redis")
})()

// app.options("*", cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(cookieParser())
app.use(morgan("tiny"))
app.use(helmet())
app.use(compression())
app.use("/api/user", router).all((_, res) => {
    res.setHeader("content-type", "application/json")
    res.setHeader("Access-Control-Allow-Origin", "*")
})

// CHECK SERVER ALIVE
router.get("/", (_, res) => {
    res.status(200).send("Hello World from user-service")
})

// CREATE USER
router.post("/", createUser)
// LOGIN
router.post("/login", login)
// LOGOUT
router.post('/logout', authenticateToken, logout)
// TOKEN REFRESH
router.post('/token', token)

// TEST TOKEN
router.post("/testToken", authenticateToken, (_, res) => {
    res.status(200).send("Hello World from user-service token test")
})

app.listen(8000, () => console.log("user-service listening on port 8000"))

// Export redis client for other files
export { redisClient }