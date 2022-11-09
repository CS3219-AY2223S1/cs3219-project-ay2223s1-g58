/* eslint-disable no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.addColumn("Rooms", "current", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      await queryInterface.removeColumn("Rooms", "question_id"),
      await queryInterface.addColumn("Rooms", "question_ids", {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn("Rooms", "current"),
      await queryInterface.addColumn("Rooms", "question_id", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      await queryInterface.removeColumn("Rooms", "question_ids"),
    ]);
  },
};
