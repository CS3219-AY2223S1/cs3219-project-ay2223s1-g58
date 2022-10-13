/* eslint-disable no-unused-vars */
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Room.init(
    {
      roomId: {
        type: DataTypes.STRING,
        field: "room_id",
      },
      questionId: {
        type: DataTypes.NUMBER,
        field: "question_id",
      },
      userId1: {
        type: DataTypes.STRING,
        field: "user_id_1",
      },
      userId2: {
        type: DataTypes.STRING,
        field: "user_id_2",
      },
    },
    {
      sequelize,
      modelName: "Room",
    }
  );
  return Room;
};
