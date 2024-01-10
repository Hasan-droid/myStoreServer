"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn("items", "itemId", {
        type: Sequelize.INTEGER,
        allowNull: false,
      });

      await queryInterface.addColumn("items", "itemName", {
        type: Sequelize.STRING,
        allowNull: false,
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
