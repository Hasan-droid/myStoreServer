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
const Customer = require("./customers.model")(sequelize, DataTypes);
const Order = require("./orders.model")(sequelize, DataTypes);
const Item = require("./items.model")(sequelize, DataTypes);

Customer.hasMany(Order, { foreignKey: "customerId" });
Order.belongsTo(Customer, { foreignKey: "customerId" });

Order.hasMany(Item, { foreignKey: "orderId" });
Item.belongsTo(Order, { foreignKey: "orderId" });

Card.hasMany(productImage, { foreignKey: "cardId" });
productImage.belongsTo(Card, { foreignKey: "cardId" });

const db = {};
db.sequelize = sequelize;
db.cardModel = Card;
db.productImageModel = productImage;
db.customerModel = Customer;
db.orderModel = Order;
db.itemModel = Item;
db.chartModel = require("./chart.model")(sequelize, DataTypes);
db.userModel = require("./users.model")(sequelize, DataTypes);

module.exports = db;
