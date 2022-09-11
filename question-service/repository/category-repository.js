const db = require('../models')

const CategoryRepository = {
    create: function (id, difficulty, type) {
        return db.Category.create({
            difficulty: difficulty,
            types: type,
            q_id: id,
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
}

module.exports = CategoryRepository
