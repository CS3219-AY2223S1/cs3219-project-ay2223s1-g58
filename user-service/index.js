import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet";
import compression from "compression";
import { createUser, login, logout } from "./controller/user-controller.js"
import { authenticateToken } from './middleware.js'

const app = express()
const router = express.Router()

app.options("*", cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(morgan("tiny"))
app.use(helmet())
app.use(compression())
app.use("/api/user", router).all((_, res) => {
    res.setHeader("content-type", "application/json")
    res.setHeader("Access-Control-Allow-Origin", "*")
})

// CHECK SERVER ALIVE
router.get("/", (_, res) => res.status(200).send("Hello World from user-service"))
// CREATE USER
router.post("/", createUser)
// LOGIN
router.post("/login", login)
// LOGOUT
router.post('/logout', authenticateToken, logout)
// TOKEN REFRESH
// router.post('/token', token)

app.listen(8000, () => console.log("user-service listening on port 8000"))
