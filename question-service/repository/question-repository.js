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
}

module.exports = QuestionRepository
