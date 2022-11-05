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
  findByUserId: function (userId) {
    return db.Room.findOne({
      where: {
        [Sequelize.Op.or]: [{ userId1: userId }, { userId2: userId }],
      },
    });
  },
  update: function (roomId, updatedRoom) {
    return db.Room.update(updatedRoom, {
      where: {
        roomId: roomId,
      },
    });
  },
  create: function (roomId, questionId, userId1, userId2, difficulty, types) {
    return db.Room.create({ roomId, questionId, userId1, userId2, difficulty, types });
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
