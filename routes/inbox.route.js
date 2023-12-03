const express = require("express");
const router = express.Router();
const { customerModel } = require("../model");
const { orderModel } = require("../model");
const { itemModel } = require("../model");
const VerfiyAdminToken = require("../middleware/VerfiyAdminToken");

router.use(VerfiyAdminToken);

router.get("/:id", async (req, res) => {
  debugger;
  const orederId = req.params.id;
  const items = await itemModel.findAll({ where: { orderId: orederId } });
  return res.status(200).json([...items]);
});

router.get("/", async (req, res) => {
  debugger;
  const { limit, offset } = req.query;

  // const customer = req.query;
  const orders = await customerModel.findAll({
    include: { model: orderModel },
    order: [[orderModel, "id", "desc"]],
  });
  //map order.phone and order.orders in same array of objects
  let numberOfPendingOrders = 0;
  const mapOrders = orders
    .map((customer) => {
      return customer.orders.map((order) => {
        if (order.dataValues.orderStatus === "pending") {
          numberOfPendingOrders++;
        }
        return {
          customerName: customer.name,
          phoneNumber: customer.phone,
          address: customer.address,
          email: customer.email,
          ...order.dataValues,
        };
      });
    })
    .flat()
    .slice(offset, offset + limit);

  const data = {
    orders: mapOrders,
    numberOfPendingOrders,
  };
  return res.status(200).json(data);
});

router.put("/:id", async (req, res) => {
  debugger;
  const orderId = parseInt(req.params.id);
  const order = req.body;
  const updatedOrder = await orderModel.update(order, { where: { id: orderId } });
  const getUpdatedOrder = await orderModel.findByPk(orderId);
  const customer = await customerModel.findByPk(getUpdatedOrder.customerId);
  const data = {
    customerName: customer.name,
    phoneNumber: customer.phone,
    address: customer.address,
    email: customer.email,
    ...getUpdatedOrder.dataValues,
  };
  return res.status(200).json({ msg: "order updated successfully", updatedOrder: data });
});

exports.router = router;
