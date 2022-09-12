const QuestionRepository = require('../repository/question-repository')
const CategoryRepository = require('../repository/category-repository')

async function createQuestion(req, res) {
    try {
        const { name, type, content, difficulty } = req.body
        if (name && content && difficulty) {
            difficulty.toLowerCase()
            const question = await QuestionRepository.create(name, content)
            console.log('Question created succesfully with id: ' + question.id)
            await CategoryRepository.create(question.id, difficulty, [type])
            console.log('Category created succesfully for q_id: ' + question.id)
            return res
                .status(201)
                .json({ message: `Create new question successfully!` })
        } else {
            return res.status(400).json({
                message:
                    'Question name, difficulty and/or content are missing!',
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: 'Database failure when creating new question! ' + err,
        })
    }
}

async function getQuestionById(req, res) {
    try {
        const { id } = req.body
        if (id) {
            const question = await QuestionRepository.findById(id)
            return res.status(201).json({
                id: question.id,
                name: question.name,
                content: question.content,
            })
        } else {
            return res.status(400).json({ message: 'Missing "id" field' })
        }
    } catch (err) {
        return res.status(500).json({
            message: 'Database failure when retrieving the question! ' + err,
        })
    }
}

async function getQuestionByDifficulty(req, res) {
    try {
        const { difficulty } = req.body
        if (difficulty) {
            var questionId
            var questionDifficulty
            var types
            await CategoryRepository.findByDifficulty(
                difficulty
            )
                .then((data) => {
                    questionId = String(data[0].questionId)
                    questionDifficulty = data[0].difficulty
                    types = data[0].types
                })
                .catch((err) => {
                    return res.status(500).json({
                        message:
                            'Database failure when retrieving the category! ' +
                            err,
                    })
                })
            console.log('Question id retrieved: ' + questionId)
            const question = await QuestionRepository.findById(questionId)
            console.log('Question retrieved: ' + question.name)
            return res.status(201).json({
                id: question.id,
                name: question.name,
                content: question.content,
                difficulty: questionDifficulty,
                types: types[0],
            })
        } else {
            return res.status(400).json({ message: `Difficulty is missing!` })
        }
    } catch (err) {
        return res.status(500).json({
            message: 'Database failure when retrieving the question! ' + err,
        })
    }
}

async function deleteQuestionById(req, res) {
    try {
        const { id } = req.body
        if (id) {
            await QuestionRepository.deleteById(id)
            return res
                .status(201)
                .json({ message: `Question deleted succesfully` })
        } else {
            return res
                .status(400)
                .json({ message: 'Question id is missing for deletion' })
        }
    } catch (err) {
        return res.status(500).json({
            message: 'Database failure when retrieving the question! ' + err,
        })
    }
}


module.exports = {
    createQuestion,
    getQuestionByDifficulty,
    deleteQuestionById,
    getQuestionById,
}
