const Sequelize = require("sequelize");
const db = require("../models/index");

const MatchRepository = {
  findByDifficulty: function (difficulty, socketId) {
    return db.Match.findOne({
      where: {
        difficulty: difficulty,
        socketId: {
          [Sequelize.Op.ne]: socketId,
        },
      },
    });
  },
  findByTypesAndDifficulty: function (difficulty, types, socketId) {
    return db.Match.findOne({
      where: {
        [Sequelize.Op.and]: [
          { difficulty: difficulty },
          {
            socketId: {
              [Sequelize.Op.ne]: socketId,
            },
          },
          {
            types: {
              [Sequelize.Op.or]: [null, "", types],
            },
          },
        ],
      },
    });
  },
  findBySocketId: function (socketId) {
    return db.Match.findOne({
      where: {
        socketId: socketId,
      },
    });
  },
  create: function (socketId, difficulty, types, userId) {
    return db.Match.create({ socketId, difficulty, userId, types });
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
