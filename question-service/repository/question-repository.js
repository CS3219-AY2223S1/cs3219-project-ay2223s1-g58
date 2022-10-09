const db = require('../models')

const QuestionRepository = {
    findById: function (id) {
        return db.Question.findOne({
            where: {
                id: id,
            },
        })
    },
    create: function (name, content) {
        return db.Question.create({
            name: name,
            content: content,
        })
    },
    deleteById: function (id) {
        return db.Question.destroy({
            where: {
                id: id,
            },
        })
    },
    update: function (question) {
        return db.Question.update(
            {
                name: question.name,
                content: question.content,
            },
            { where: { id: question.id } }
        )
    },
    getRandomQuestion: function () {
        return db.Question.findAll({
            order: db.sequelize.random(),
            limit: 1,
        })
    },
    getAllQuestion: function () {
        return db.Question.findAll({
            distinct: true,
            include: [db.Category],
        })

    },
}

module.exports = QuestionRepository
