const express = require("express");
const router = express.Router();
const { customerModel } = require("../model");
const { orderModel } = require("../model");
const VerifyUserToken = require("../middleware/VerifyUserToken");

router.post("/", VerifyUserToken, async (req, res) => {
  debugger;
  const customer = req.body.customer;
  const items = req.body.items;
  const totalPriceForOrder = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const order = {
    totalPrice: totalPriceForOrder,
    deliveredDate: null,
    orderStatus: "pending",
  };
  const itemsWithItemIds = items.map((item) => {
    //add itemId property to each item
    //delete id property from each item
    const images = item.images.map((image) => image.url);
    const itemId = item.id;
    delete item.images;
    delete item.id;
    return { ...item, images, itemId: itemId };
  });

  const findCustomerByPhone = await customerModel.findOne({ where: { phone: customer.phone } });
  if (findCustomerByPhone) {
    const newOrder = await findCustomerByPhone.createOrder(order);
    await Promise.all(
      itemsWithItemIds.map(async (item) => {
        await newOrder.createItem(item);
      })
    );
    return res.status(200).json({ msg: "order created successfully" });
  }

  const newCustomer = await customerModel.create(customer);
  const newOrder = await newCustomer.createOrder(order);
  await Promise.all(
    itemsWithItemIds.map(async (item) => {
      await newOrder.createItem(item);
    })
  );
  return res.status(200).json({ msg: "order created successfully" });
});

router.get("/orders", async (req, res) => {
  const customer = req.query;
  const orders = await customerModel.findAll({
    order: [[orderModel, "createdAt", "DESC"]],
    where: { email: customer.email },
    include: { model: orderModel },
  });
  //map order.phone and order.orders in same array of objects
  const mapOrders = orders
    .map((customer) => {
      return customer.orders.map((order) => {
        return { phone: customer.phone, ...order.dataValues };
      });
    })
    .flat();
  setTimeout(() => {
    return res.status(200).json([...mapOrders]);
  }, 2000);
});

exports.router = router;
