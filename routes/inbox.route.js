const express = require("express");
const router = express.Router();
const { customerModel } = require("../model");
const { orderModel } = require("../model");
const { itemModel } = require("../model");
const VerifyUserToken = require("../middleware/VerifyUserToken");
const VerfiyAdminToken = require("../middleware/VerfiyAdminToken");

router.get("/:id", async (req, res) => {
  debugger;
  const orederId = req.params.id;
  const items = await itemModel.findAll({ where: { orderId: orederId } });
  return res.status(200).json([...items]);
});

router.get("/", async (req, res) => {
  // const customer = req.query;
  const orders = await customerModel.findAll({
    order: [[orderModel, "createdAt", "DESC"]],
    include: { model: orderModel },
  });
  //map order.phone and order.orders in same array of objects
  const mapOrders = orders
    .map((customer) => {
      return customer.orders.map((order) => {
        return {
          customerName: customer.name,
          phoneNumber: customer.phone,
          address: customer.address,
          email: customer.email,
          ...order.dataValues,
        };
      });
    })
    .flat();
  return res.status(200).json([...mapOrders]);
});

router.put("/:id", async (req, res) => {
  debugger;
  const orderId = parseInt(req.params.id);
  const order = req.body;
  const updatedOrder = await orderModel.update(order, { where: { id: orderId } });
  return res.status(200).json({ msg: "order updated successfully" });
});

exports.router = router;
