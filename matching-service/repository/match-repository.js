import db from "../models";

const MatchRepository = {
  findByDifficulty: function (difficulty) {
    return db.Model.findAll({
      where: {
        difficulty: difficulty,
      },
    });
  },
  create: function (id, difficulty) {
    return db.Model.create({ socket_id: id, difficulty });
  },
  delete: function (id) {
    return db.Model.destroy({
      where: {
        socket_id: id,
      },
    });
  },
};

export default MatchRepository;
