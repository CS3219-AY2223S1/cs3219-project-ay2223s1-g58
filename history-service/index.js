import express from 'express'
import cors from 'cors'
import { getHistory, createHistory, deleteHistory, updateHistory } from './handler/handler.js'
import 'dotenv/config'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
if (process.env.ENV === "production") {
  app.use(cors())
  app.options('*', cors())
} else {
  app.use(
    cors({
      origin: `http://localhost:${process.env.PORT || 3000}`,
      credentials: true,
    })
  )
}

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
