/* eslint-disable no-unused-vars */
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Match.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      socketId: {
        type: DataTypes.STRING,
        field: "socket_id",
      },
      difficulty: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.STRING,
        field: "user_id",
      },
    },
    {
      sequelize,
      modelName: "Match",
    }
  );
  return Match;
};
