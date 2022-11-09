'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.belongsTo(models.Question, {
                foreignKey: 'questionId',
            })
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
                unique: true,
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
