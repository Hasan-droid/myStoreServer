const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const customer = sequelize.define("customer", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add other columns as needed
  });

  return customer;
};
