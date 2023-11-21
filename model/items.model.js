const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const item = sequelize.define("item", {
    image: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalOrdered: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Add other columns as needed
  });

  item.associate = (models) => {
    item.belongsTo(models.order, { foreignKey: "orderId" });
  };

  return item;
};
