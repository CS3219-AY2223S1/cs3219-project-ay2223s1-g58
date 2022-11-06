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
  create: function (socketId, difficulty, types, userId) {
    return db.Match.create({ socketId, difficulty, userId, types });
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
