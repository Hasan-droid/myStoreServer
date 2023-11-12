module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define("Card", {
    title: {
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
    category: {
      type: DataTypes.ENUM,
      values: ["waterSpaces", "candles"],
      defaultValue: "waterSpaces",
      allowNull: false,
    },
  });
  Card.associate = (models) => {
    Card.hasMany(models.Image, { foreignKey: "cardId" });
  };
  return Card;
};
