"use strict";
const casual = require("casual");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const ordersData = Array.from({ length: 15 }).map(() => ({
        totalPrice: casual.integer(1, 1000),
        deliveredDate: Math.random() > 0.5 ? casual.date("YYYY-MM-DD") : null,
        orderStatus: "pending",
        customerId: 99,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await queryInterface.bulkInsert("orders", ordersData, {});
      const ordersIds = await queryInterface.sequelize.query(`SELECT id from orders;`);
      const itemsData = ordersIds[0].map((orderId) => {
        return Array.from({ length: casual.integer(1, 5) }).map(() => {
          return {
            itemId: casual.integer(1, 100),
            itemName: casual.word,
            images: [casual.url],
            category: casual.word,
            description: casual.sentence,
            price: casual.double(1, 100),
            quantity: casual.integer(1, 10),
            totalPrice: casual.double(1, 1000),
            orderId: orderId.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        });
      });

      //get orders ids
      console.log("ordersIds", ordersIds);
      //console.log("itemsData", itemsData);
      // const items = itemsData.flat();
      // console.log("items", items);
      await queryInterface.bulkInsert("items", itemsData.flat(), {});
    } catch (err) {
      console.log("error here", err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete("items", null, {});
      await queryInterface.bulkDelete("orders", null, {});
    } catch (err) {
      console.log("error", err);
    }
  },
};
