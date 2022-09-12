const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

const {
    createQuestion,
    getQuestionByDifficulty,
    deleteQuestionById,
    getQuestionById,
} = require('./controller/question-controller')
const router = express.Router()

// Controller will contain all the User-defined Routes
// CHECK SERVER ALIVE
router.get('/', (_, res) => {
    res.status(200).send('Hello World from question-service')
})

router.post('/id', getQuestionById)
router.post('/difficulty', getQuestionByDifficulty)
router.post('/', createQuestion)
router.post('/delete', deleteQuestionById)

// CHECK SERVER ALIVE
app.use('/api/v1/question', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(8500, () => console.log('question-service listening on port 8500'))
