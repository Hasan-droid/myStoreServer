const { Sequelize, DataTypes, Model } = require("sequelize");
require("dotenv").config();

const POSTGRES_URL = process.env.DATABASE_URL;
// const sequelizeOption =
//   {
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//   }
const sequelizeOption = {};

let sequelize = new Sequelize(POSTGRES_URL, sequelizeOption);

const Card = require("./card.model")(sequelize, DataTypes);
const productImage = require("./productImage.model")(sequelize, DataTypes);

Card.hasMany(productImage, { foreignKey: "cardId" });
productImage.belongsTo(Card, { foreignKey: "cardId" });

const db = {};
db.sequelize = sequelize;
db.cardModel = Card;
db.productImageModel = productImage;
db.chartModel = require("./chart.model")(sequelize, DataTypes);
db.userModel = require("./users.model")(sequelize, DataTypes);

module.exports = db;
