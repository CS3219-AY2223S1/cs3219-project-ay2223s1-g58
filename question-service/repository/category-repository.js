const db = require('../models')

const CategoryRepository = {
    create: function (id, difficulty, type) {
        return db.Category.create({
            difficulty: difficulty,
            types: type,
            questionId: id,
        })
    },
    findByDifficulty: function (difficulty) {
        return db.Category.findAll({
            where: {
                difficulty: difficulty,
            },
            order: db.sequelize.random(),
            limit: 1,
        })
    },
    findByQuestionId: function (id) {
        return db.Category.findOne({
            where: {
                questionId: id,
            },
        })
    },
}

module.exports = CategoryRepository
