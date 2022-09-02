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
      socketId: {
        type: DataTypes.INTEGER,
        field: "socket_id",
      },
      difficulty: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Match",
    }
  );
  return Match;
};
