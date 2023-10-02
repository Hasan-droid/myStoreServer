module.exports = (sequelize, DataTypes) => {
  const Chart = sequelize.define("Charts", {
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
  return Chart;
};
