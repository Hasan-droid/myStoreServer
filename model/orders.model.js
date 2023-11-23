const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const order = sequelize.define("order", {
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deliveredDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    orderStatus: {
      //want the type to be ENUM
      type: DataTypes.ENUM,
      values: ["pending", "on deliver", "delivered"],
      allowNull: false,
    },
    // Add other columns as needed
  });

  order.associate = (models) => {
    order.belongsTo(models.customer, { foreignKey: "customerId" });
  };

  return order;
};
