"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.changeColumn("order", "deliveredDate", {
        allowNull: true,
        type: Sequelize.STRING,
      });
    } catch (err) {
      console.log("error  in up", err);
    }
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("order", "deliveredDate", {
      allowNull: false,
      type: Sequelize.STRING,
    });

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
