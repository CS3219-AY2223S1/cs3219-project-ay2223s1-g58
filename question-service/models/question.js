'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Question extends Model {
        static associate(models) {
            Question.hasOne(models.Category, {
                foreignKey: 'questionId',
            })
        }
    }
    Question.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Question',
        }
    )
    return Question
}
