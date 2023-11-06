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

const db = {};
db.sequelize = sequelize;
db.cardModel = require("./card.model")(sequelize, DataTypes);
db.chartModel = require("./chart.model")(sequelize, DataTypes);
db.userModel = require("./users.model")(sequelize, DataTypes);

module.exports = db;
