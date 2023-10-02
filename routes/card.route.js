const express = require("express");
const verifyToken = require("../middleware/VerfiyToken");
const router = express.Router();
const { cardModel } = require("../model");

const enumValues = ["waterSpaces", "candles"];

const checkReqBody = (req, res, next) => {
  try {
    if (!req.body.title || !req.body.description || !req.body.price || !req.body.category || req.body.price < 0) {
      return res.status(400).json({ msg: "please include all fields" });
    }
    if (
      req.body.title.trim() === null ||
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
  const cards = await cardModel.findAll({ limit, offset, where: { category: req.query.page || enumValues[0] } });
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
  const newCard = await cardModel.create(req.body);
  //handle error here
  console.log("//////////////NEW CARD", newCard);
  res.json(newCard);
});

exports.router = router;
