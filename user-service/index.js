import express from "express"
import cors from "cors"
import { createUser, login } from "./controller/user-controller.js"
import cookieParser from "cookie-parser"

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.options("*", cors())

const router = express.Router()

// Controller will contain all the User-defined Routes
router.get("/", (_, res) => res.send("Hello World from user-service"))
router.post("/", createUser)

router.post("/login", login)

// router.post('/logout', logout)
// router.post('/refresh', logout)

app.use("/api/user", router).all((_, res) => {
    res.setHeader("content-type", "application/json")
    res.setHeader("Access-Control-Allow-Origin", "*")
})

app.listen(8000, () => console.log("user-service listening on port 8000"))
