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

async function getQuestionNames(req, res) {
    try {
        let { id } = req.query
        if (!(id instanceof Array)) {
            // If there is only 1 id, the value will not be an array
            id = [id]
        }
        const questionArray = await QuestionRepository.findQuestionsById(id)
        const id2name = {}
        questionArray.forEach((q) => (id2name[q.id] = q.name))
        return res.status(200).json({
            message: 'Question names successfully!',
            data: id2name,
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Database failure when retriving question names! ' + err,
        })
    }
}

async function getAllQuestions(req, res) {
    try {
        const questions = await QuestionRepository.getAllQuestion()
        return res.status(200).json({
            message: 'All questions retrieved!',
            questions: questions,
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Database failure when retriving all questions! ' + err,
        })
    }
}

async function getAllTypes(req, res) {
    try {
        const allTypes = await CategoryRepository.getAllTypes()
        let union = []
        allTypes.map(
            (arr) => (union = Array.from(new Set([...union, ...arr.types])))
        )
        return res.status(200).json({
            message: 'All types retrieved!',
            types: union,
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Database failure when retriving all questions! ' + err,
        })
    }
}

async function getNextQuestion(req, res) {
    try {
        var category, question
        const { past_id, difficulty, types } = req.query
        console.log(past_id)
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

async function updateQuestion(req, res) {
    try {
        const id = req.body.id
        const question = await QuestionRepository.findById(id)
        const category = await CategoryRepository.findByQuestionId(id)

        if (req.body?.name) {
            question.name = req.body.name
        }

        if (req.body?.content) {
            question.content = req.body.content
        }

        if (req.body?.difficulty) {
            category.difficulty = req.body.difficulty
        }

        if (req.body?.types) {
            category.types = req.body.types
        }

        await QuestionRepository.update(question)
        await CategoryRepository.update(category)

        return res.status(200).json({
            message: 'Question updated succesfully',
            id: question.id,
            name: question.name,
            difficulty: category.difficulty,
            types: category.types,
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Database failure when retrieving the question! ' + err,
        })
    }
}

module.exports = {
    createQuestion,
    getQuestionNames,
    getAllQuestions,
    getQuestion,
    deleteQuestionById,
    updateQuestion,
    getNextQuestion,
    getAllTypes,
}
