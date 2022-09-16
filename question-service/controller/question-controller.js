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

async function getQuestion(req, res) {
    try {
        // const { difficulty } = req.params
        const { difficulty } = req.query
        const { id } = req.query

        if (difficulty) {
            var questionId
            var questionDifficulty
            var types
            await CategoryRepository.findByDifficulty(difficulty)
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
            return res.status(200).json({
                id: question.id,
                name: question.name,
                content: question.content,
                difficulty: questionDifficulty,
                types: types[0],
            })
        } else if (id) {
            const question = await QuestionRepository.findById(id)
            const category = await CategoryRepository.findByQuestionId(id)
            return res.status(200).json({
                id: question.id,
                name: question.name,
                content: question.content,
                difficulty: category.difficulty,
                types: category.types,
            })
        } else {
            return res
                .status(400)
                .json({ message: `Difficulty/Question ID is missing!` })
        }
    } catch (err) {
        return res.status(500).json({
            message: 'Database failure when retrieving the question! ' + err,
        })
    }
}

async function deleteQuestionById(req, res) {
    try {
        const { id } = req.query
        if (id) {
            await QuestionRepository.deleteById(id)
            return res
                .status(200)
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

async function updateQuestionById(req, res) {
    try {
        const { id, name, content, difficulty, types } = req.body
        if (id && name && content) {
            await QuestionRepository.updateQuestionNameContentById(name, content, id)
        } else if (id && name) {
            await QuestionRepository.updateQuestionNameById(name, id)
        } else if (id && content) {
            await QuestionRepository.updateQuestionContentById
        } else {
            if (!id || (!difficulty && !types && !name && !content)) {
                return res.status(400).json({ message: 'Missing id or update contents!'})
            }    
        }

        if (difficulty) {
            await CategoryRepository.updateDifficultyByQuestionId(difficulty, id)
        }

        if (types) {
            await CategoryRepository.updateTypesByQuestionId(types, id)
        }

        return res.status(200).json({message: 'Question updated succesfully'})
    } catch (err) {
        return res.status(500).json({
            message: 'Database failure when retrieving the question! ' + err,
        })
    }
}

module.exports = {
    createQuestion,
    getQuestion,
    deleteQuestionById,
    updateQuestionById
}
