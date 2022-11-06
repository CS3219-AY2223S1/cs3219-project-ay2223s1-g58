const express = require('express')
const cors = require('cors')

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
const {
    createQuestion,
    getQuestion,
    deleteQuestionById,
    updateQuestion,
    getNextQuestion,
    getAllQuestions,
    getAllTypes,
    getQuestionNames,
} = require('./controller/question-controller')
const router = express.Router()

// Controller will contain all the User-defined Routes

router.get('/status', (_, res) => {
    res.status(200).send({ message: 'Hello World from question-service' })
})

router.get('', getQuestion)
router.get('/nextQuestion', getNextQuestion)
router.get('/allQuestions', getAllQuestions)
router.get('/questionNames', getQuestionNames)
router.get('/allTypes', getAllTypes)
router.post('/', createQuestion)
router.put('/', updateQuestion)
router.delete('', deleteQuestionById)

app.use('/api/v1/question', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(8500, () => console.log('question-service listening on port 8500'))

module.exports = app
