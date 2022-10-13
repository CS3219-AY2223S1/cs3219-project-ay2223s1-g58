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
  update: function (updatedRoom) {
    return db.Room.update(updatedRoom);
  },
  create: function (roomId, questionId, userId1, userId2, difficulty) {
    return db.Room.create({ roomId, questionId, userId1, userId2, difficulty });
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
