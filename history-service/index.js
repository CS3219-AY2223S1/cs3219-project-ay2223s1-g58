import express from 'express'
import cors from 'cors'
import { getHistory, addHistory } from "./handler/handler.js"

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  cors({
    origin: `http://localhost:${process.env.PORT || 3000}`,
    credentials: true,
  })
)
// app.options('*', cors())

const router = express.Router()
router.get('/:uid', getHistory)
router.post('/:roomId', addHistory)

const URL_PREFIX = '/api/v1/history'
app.use(URL_PREFIX, router).all((_, res) => {
  res.setHeader('content-type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
})

// Test server
app.get('/', (req, res) => {
  res.send('Hello World from history-service')
})
