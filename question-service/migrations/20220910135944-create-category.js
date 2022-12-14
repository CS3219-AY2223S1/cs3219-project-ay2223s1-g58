'use strict'
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            difficulty: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            types: {
                type: Sequelize.ARRAY(Sequelize.STRING),
            },
            questionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: { model: 'Questions', key: 'id' },
                onDelete: 'cascade',
                onUpdate: 'cascade',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Categories')
    },
}
