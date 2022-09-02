const Sequelize = require("sequelize");
const db = require("../models/index.js");

const MatchRepository = {
  // finds by difficulty excluding same socketId
  findByDifficulty: function (difficulty, socketId) {
    return db.Match.findAll({
      where: {
        difficulty: difficulty,
        socketId: {
          [Sequelize.Op.ne]: socketId,
        },
      },
    });
  },
  create: function (socketId, difficulty) {
    return db.Match.create({ socketId: socketId, difficulty });
  },
  delete: function (socketId) {
    return db.Match.destroy({
      where: {
        socketId: socketId,
      },
    });
  },
};

module.exports = MatchRepository;
