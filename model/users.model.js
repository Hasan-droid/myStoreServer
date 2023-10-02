const { hooks } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
      allowNull: false,
    },
  });

  User.addHook("beforeCreate", async (user, options) => {
    console.log("before create", user.password);
    user.password = await bcrypt.hash(user.password, 8);
  });

  return User;
};
