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

async function getQuestionByDifficulty(req, res) {
    try {
        const { difficulty } = req.body
        if (difficulty) {
            var q_id
            await CategoryRepository.findByDifficulty(difficulty)
                .then((data) => {
                    q_id = String(data[0].q_id)
                })
                .catch((err) => {
                    return res.status(500).json({
                        message:
                            'Database failure when retrieving the category! ' +
                            err,
                    })
                })
            console.log('Question id retrieved: ' + q_id)
            const question = await QuestionRepository.findById(q_id)
            console.log('Question retrieved: ' + question.q_name)
            return res.status(201).json({
                Name: question.q_name,
                Content: question.content,
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


module.exports = { createQuestion, getQuestionByDifficulty, deleteQuestionById }
