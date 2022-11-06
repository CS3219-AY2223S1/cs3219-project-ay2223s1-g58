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
    findByTypesAndDifficulty: function (difficulty, types) {
        if (!Array.isArray(types)) {
            types = [types]
        }
        return db.Category.findOne({
            where: {
                difficulty: difficulty,
                types: {
                    [Op.overlap]: types,
                },
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
    update: function (category) {
        return db.Category.update(
            {
                difficulty: category.difficulty,
                types: category.types,
            },
            {
                where: {
                    questionId: category.questionId,
                },
            }
        )
    },
    findNextQuestionOfSameDifficulty: function (difficulty, id) {
        // filter out questions in id
        const numberIds = []

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
        const numberIds = []
        for (var i = 0; i < id.length; i++) {
            numberIds.push(parseInt(id[i]))
        }
        if (!Array.isArray(types)) {
            types = [types]
        }

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
    findNextQuestionOfSameDifficultyAndTypes: function (types, difficulty, id) {
        // filter out questions in id
        const numberIds = []

        for (var i = 0; i < id.length; i++) {
            numberIds.push(parseInt(id[i]))
        }

        return db.Category.findOne({
            where: {
                difficulty: difficulty,
                types: types,
                questionId: {
                    [Op.notIn]: numberIds,
                },
            },
            order: db.sequelize.random(),
            limit: 1,
        })
    },
    getAllTypes: function () {
        return db.Category.findAll({
            distinct: true,
            attributes: ['types'],
        })
    },
    getTypesByDifficulty: function (difficulty) {
        return db.Category.findAll({
            distinct: true,
            where: {
                difficulty: difficulty,
            },
            attributes: ['types'],
        })
    },
}

module.exports = CategoryRepository
