const express = require("express");
const verifyToken = require("../middleware/VerfiyToken");
const router = express.Router();
const { cardModel } = require("../model");

const enumValues = ["waterSpaces", "candles"];

const checkReqBody = (req, res, next) => {
  try {
    console.log("/////req.body", req.body);
    if (!req.body.name || !req.body.description || !req.body.price || !req.body.category || req.body.price < 0) {
      return res.status(400).json({ msg: "please include all fields" });
    }
    if (
      req.body.name.trim() === null ||
      req.body.description === "" ||
      req.body.price === "" ||
      req.body.category === ""
    ) {
      return res.status(400).json({ msg: "please include all fields" });
    }
    if (!enumValues.includes(req.body.category) || !enumValues.includes(req.body.category)) {
      return res.status(400).json({ msg: "please include valid category" });
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

router.get("/:id", async (req, res) => {
  const card = await cardModel.findByPk(req.params.id);
  if (card) {
    res.json(card);
  } else {
    res.status(404).send("not found");
  }
});
router.get("/", async (req, res) => {
  //every hit to the route return 10 cards
  const limit = req.query.limit || 2;
  // console.log(first)
  const offset = req.query.offset || 0;
  console.log("req.query.page", req.query.page);
  const cards = await cardModel.findAll({
    limit,
    offset,
    where: { category: req.query.page || enumValues[0] },
    order: [["createdAt", "DESC"]],
  });
  res.json(cards);
});

router.post("/create100/:category", checkReqBody, async (req, res) => {
  console.log("req.params.category", req.params.category);
  for (let i = 0; i < 10; i++) {
    await cardModel.create({
      title: `card ${i}`,
      description: `card ${i} description`,
      price: Math.floor(Math.random() * 1000),
      category: req.body.category,
    });
    console.log("req.params.category", req.params.category);
  }
  res.send(`created 100 cards in ${req.body.category} category`);
});
// router.post("/create100", checkReqBody, async (req, res) => {
//   for (let i = 0; i < 100; i++) {
//     await cardModel.create({
//       title: `card ${i}`,
//       description: `card ${i} description`,
//       price: Math.floor(Math.random() * 1000),
//     });
//     console.log("req.params.category", req.params.category);
//   }
// });

router.post("/", verifyToken, checkReqBody, async (req, res) => {
  console.log("before create", req.body);
  const cardData = {
    title: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
  };
  const newCard = await cardModel.create(cardData);
  //handle error here
  console.log("//////////////NEW CARD", newCard);
  res.json(newCard);
});

router.delete("/:id", verifyToken, async (req, res) => {
  const card = await cardModel.findByPk(req.params.id);
  if (card) {
    await card.destroy();
    res.json(card);
  } else {
    res.status(404).send("not found");
  }
});

router.put("/:id", verifyToken, checkReqBody, async (req, res) => {
  const card = await cardModel.findByPk(req.params.id);
  if (card) {
    card.title = req.body.name;
    card.description = req.body.description;
    card.price = req.body.price;
    card.category = req.body.category;
    await card.save();
    res.json(card);
  } else {
    res.status(404).send("not found");
  }
});

exports.router = router;
