'use strict';
const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.belongsTo(models.Question, {
        foreignKey: 'QuestionId',
        onDelete: 'CASCADE'
      });
    }
  }
  Category.init({
    difficulty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    types: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull:true
    }, 
    QuestionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Questions', key: 'id' },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};