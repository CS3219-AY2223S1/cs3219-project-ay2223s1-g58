import express from 'express'
import cors from 'cors'
import { getHistory, createHistory, deleteHistory, updateHistory } from './handler/handler.js'
import 'dotenv/config'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const allowedOrigins = [
  'http://localhost',
  'http://localhost:80',
  'http://localhost:3000',
  'http://localhost:8000',
  'http://localhost:8080',
  'http://localhost:8001',
  'http://localhost:8022',
  'http://localhost:8500',
  'http://localhost:9000',
  'https://leetwithfriend.com',
  'https://leetwithfriend.com:80',
  'https://www.leetwithfriend.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

const router = express.Router()
router.get('/user/:uid', getHistory)
router.post('/room/', createHistory)
router.put('/room/:roomId', updateHistory)

// Delete room (for test only)
router.delete('/room/testDelete', deleteHistory)

const URL_PREFIX = '/api/v1/history'
app.use(URL_PREFIX, router).all((_, res) => {
  res.setHeader('content-type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
})

// Test server alive
app.get('/', (_, res) => {
  res.send('Hello World from history-service')
})

app.listen(8080, () => console.log('history-service listening on port 8080'))

export { app }
