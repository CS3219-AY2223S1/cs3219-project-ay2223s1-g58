const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
) // config cors so that front-end can use

const {
    createQuestion,
    getQuestion,
    deleteQuestionById,
} = require('./controller/question-controller')
const router = express.Router()

// Controller will contain all the User-defined Routes

router.get("/status", (_, res) => {
    res.status(200).send({ message: "Hello World from question-service" })
})

router.get('', getQuestion)
router.post('/', createQuestion)
router.delete('', deleteQuestionById)

app.use('/api/v1/question', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(8500, () => console.log('question-service listening on port 8500'))
