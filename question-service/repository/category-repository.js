const db = require('../models')
const { Op } = require('sequelize')

const CategoryRepository = {
    create: function (id, difficulty, type) {
        return db.Category.create({
            difficulty: difficulty,
            types: type,
            questionId: id,
        })
    },
    findByDifficulty: function (difficulty) {
        return db.Category.findOne({
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
    findByQuestionTypes: function (types) {
        if (!Array.isArray(types)) {
            types = [types]
        }
        return db.Category.findOne({
            where: {
                types: {
                    [Op.overlap]: types,
                },
            },
            order: db.sequelize.random(),
            limit: 1,
        })
    },
    updateDifficultyByQuestionId: function (difficulty, id) {
        return db.Category.update(
            {
                difficulty: difficulty,
            },
            {
                where: {
                    questionId: id,
                },
            }
        )
    },
    updateTypesByQuestionId: function (types, id) {
        return db.Category.update(
            {
                types: types,
            },
            {
                where: {
                    questionId: id,
                },
            }
        )
    },
    findNextQuestionOfSameDifficulty: function (difficulty, id) {
        // filter out questions in id
        var numberIds = []
        console.log(id)
        for (var i = 0; i < id.length; i++) {
            numberIds.push(parseInt(id[i]))
        }

        return db.Category.findOne({
            where: {
                difficulty: difficulty,
                questionId: {
                    [Op.notIn]: numberIds,
                },
            },
            order: db.sequelize.random(),
            limit: 1,
        })
    },
    findNextQuestionOfSameTypes: function (types, id) {
        var numberIds = []
        for (var i = 0; i < id.length; i++) {
            numberIds.push(parseInt(id[i]))
        }
        if (!Array.isArray(types)) {
            types = [types]
        }
        console.log(types)
        return db.Category.findOne({
            where: {
                types: {
                    [Op.overlap]: types,
                },
                questionId: {
                    [Op.notIn]: id,
                },
            },
            order: db.sequelize.random(),
            limit: 1,
        })
    },
}

module.exports = CategoryRepository
