const db = require("../models/index.js");

const MatchRepository = {
  findByDifficulty: function (difficulty) {
    return db.Match.findAll({
      where: {
        difficulty: difficulty,
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
