'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {

        }
    }
    Category.init(
        {
            difficulty: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            types: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true,
            },
            questionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Questions', key: 'id' },
                onDelete: 'cascade',
                onUpdate: 'cascade',
            },
        },
        {
            sequelize,
            modelName: 'Category',
        }
    )
    return Category
}
