const Sequelize = require("sequelize");
const db = require("../models/index");

const MatchRepository = {
  findByDifficulty: function (difficulty, socketId) {
    return db.Match.findOne({
      where: {
        difficulty,
        socketId: {
          [Sequelize.Op.ne]: socketId,
        },
      },
    });
  },
  findBySocketId: function (socketId) {
    return db.Match.findOne({
      where: {
        socketId,
      },
    });
  },
  findById: function (id) {
    return db.Match.findOne({
      where: {
        id,
      },
    });
  },
  create: function (socketId, difficulty, userId) {
    return db.Match.create({ socketId, difficulty, userId });
  },
  deleteBySocketId: function (socketId) {
    return db.Match.destroy({
      where: {
        socketId,
      },
    });
  },
  deleteById: function (id) {
    return db.Match.destroy({
      where: {
        id,
      },
    });
  },
};

module.exports = MatchRepository;
