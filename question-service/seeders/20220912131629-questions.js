'use strict'


module.exports = {
    async up(queryInterface, Sequelize) {
        const fs = require('fs')
        const questionPath = './seeders/question.json'
        const categoryPath = './seeders/category.json'

        const questions = await queryInterface.rawSelect(
            'Questions',
            { 
                where: {
                    id: 1
                },
                plain: false 
            },
            ['id']
        )
        if (questions.length == 0) {
            const data = JSON.parse(fs.readFileSync(questionPath))
            await queryInterface.bulkInsert('Questions', data)
        }

        const categories = await queryInterface.rawSelect(
            'Categories',
            { where: {
                questionId: 1
            }, 
            plain: false },
            ['id']
        )

        if (categories.length == 0) {
            const data = JSON.parse(fs.readFileSync(categoryPath))
            queryInterface.bulkInsert('Categories', data)
        }
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Categories', null, {})
        await queryInterface.bulkDelete('Questions', null, {})
    },
}
