const QuestionRepository = require('../repository/question-repository')
const CategoryRepository = require('../repository/category-repository')

async function createQuestion(req, res) {
    try {
        const { name, type, content, difficulty } = req.body
        if (name && content && difficulty) {
            difficulty.toLowerCase()
            const question = await QuestionRepository.create(name, content)
            await CategoryRepository.create(question.id, difficulty, type)
            return res
                .status(201)
                .json({ message: 'Create new question successfully!' })
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

async function getNextQuestion(req, res) {
    try {
        var category, question
        const { past_id, difficulty, types } = req.query
        if (!types && !difficulty) {
            return res
                .status(400)
                .json({ message: `The difficulty/types is missing!` })
        } else if (types) {
            category = await CategoryRepository.findNextQuestionOfSameTypes(
                types,
                past_id
            )
            question = await QuestionRepository.findById(category.questionId)
        } else if (difficulty) {
            category =
                await CategoryRepository.findNextQuestionOfSameDifficulty(
                    difficulty,
                    past_id
                )
            question = await QuestionRepository.findById(category.questionId)
        } else {
            return res.status(400).json({ message: `Unexpected format` })
        }
        return res.status(200).json({
            id: question.id,
            name: question.name,
            content: question.content,
            difficulty: category.difficulty,
            types: category.types,
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Database failure when retrieving the question! ' + err,
        })
    }
}

async function getQuestion(req, res) {
    try {
        const { difficulty, id, types } = req.query
        var category, question
        if (difficulty) {
            category = await CategoryRepository.findByDifficulty(difficulty)
            question = await QuestionRepository.findById(category.questionId)
        } else if (types) {
            category = await CategoryRepository.findByQuestionTypes(types)
            question = await QuestionRepository.findById(category.questionId)
        } else if (id) {
            question = await QuestionRepository.findById(id)
            category = await CategoryRepository.findByQuestionId(id)
        } else {
            return res
                .status(400)
                .json({ message: `Difficulty/Question ID is missing!` })
        }

        return res.status(200).json({
            id: question.id,
            name: question.name,
            content: question.content,
            difficulty: category.difficulty,
            types: category.types,
        })
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
            await QuestionRepository.updateQuestionNameContentById(
                name,
                content,
                id
            )
        } else if (id && name) {
            await QuestionRepository.updateQuestionNameById(name, id)
        } else if (id && content) {
            await QuestionRepository.updateQuestionContentById
        } else {
            if (!id || (!difficulty && !types && !name && !content)) {
                return res
                    .status(400)
                    .json({ message: 'Missing id or update contents!' })
            }
        }

        if (difficulty) {
            await CategoryRepository.updateDifficultyByQuestionId(
                difficulty,
                id
            )
        }

        if (types) {
            await CategoryRepository.updateTypesByQuestionId(types, id)
        }

        return res.status(200).json({ message: 'Question updated succesfully' })
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
    updateQuestionById,
    getNextQuestion,
}
