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
    updateQuestionNameById: function(name, id) {
        return db.Question.update({
            name: name
        }, {where: {id: id}})
    },
    updateQuestionContentById: function(content, id) {
        return db.Question.update({
            content: content
        }, {where: {id: id}})
    },
    updateQuestionNameContentById: function(name, content, id) {
        return db.Question.update({
            name: name,
            content: content
        }, {where: {id: id}})
    }
}

module.exports = QuestionRepository
