const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const productImage = sequelize.define("Image", {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add other columns as needed
  });

  productImage.associate = (models) => {
    productImage.belongsTo(models.Card, { foreignKey: "cardId" });
  };

  return productImage;
};
