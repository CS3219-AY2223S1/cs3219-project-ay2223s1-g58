'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Question extends Model {

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
