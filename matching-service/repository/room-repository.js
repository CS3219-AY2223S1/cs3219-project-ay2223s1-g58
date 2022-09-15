const Sequelize = require("sequelize");
const db = require("../models/index");

const RoomRepository = {
  findByRoomId: function (roomId) {
    return db.Room.findOne({
      where: {
        roomId: roomId,
      },
    });
  },
  create: function (roomId, questionId) {
    return db.Room.create({ roomId, questionId });
  },
  delete: function (roomId) {
    return db.Room.destroy({
      where: {
        roomId: roomId,
      },
    });
  },
};

module.exports = RoomRepository;
