const express = require("express");
const verifyToken = require("../middleware/VerfiyToken");
const router = express.Router();
const { cardModel } = require("../model");
const { productImageModel } = require("../model");
const { uploadImage } = require("../js/UploadImage");
const { updateImage } = require("../js/UploadImage");
const { deleteImage } = require("../js/UploadImage");

const enumValues = ["waterSpaces", "candles"];

const checkReqBody = (req, res, next) => {
  try {
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
  const cardsWithImages = await Promise.all(
    cards.map(async (card) => {
      const images = await productImageModel.findAll({
        where: { cardId: card.id },
        order: [["createdAt", "DESC"]],
      });
      // Add the 'images' property to each card
      return { ...card.toJSON(), images };
    })
  );

  res.json(cardsWithImages);
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
  // console.log("before create", req.body);
  debugger;
  const imageUrl = await uploadImage(req.body.image);
  if (!imageUrl) return res.status(400).json({ msg: "upload image problem" });
  const cardData = {
    title: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
  };
  const newCard = await cardModel
    .create(cardData)
    .then(async (card) => {
      const image = await productImageModel.create({ url: imageUrl, cardId: card.id });
      console.log("imageCreated", image);
    })
    .catch((err) => {
      console.log("error creating image", err);
    });
  //handle error here
  console.log("//////////////NEW CARD", newCard);
  res.json(newCard);
});

router.delete("/:id", verifyToken, async (req, res) => {
  const card = await cardModel.findByPk(req.params.id);
  //find all images of the card
  const images = await productImageModel.findAll({ where: { cardId: req.params.id } });
  //delete the image from cloudinary
  await Promise.all(images.map(async (image) => await deleteImage(image.url)));
  //delete all images of the card
  await Promise.all(images.map(async (image) => await image.destroy()));
  if (card) {
    await card.destroy();
    res.json(card);
  } else {
    res.status(404).send("not found");
  }
});

router.put("/:id", verifyToken, checkReqBody, async (req, res) => {
  debugger;
  try {
    const card = await cardModel.findByPk(req.params.id);
    if (card) {
      card.title = req.body.name;
      card.description = req.body.description;
      card.price = req.body.price;
      card.category = req.body.category;
      await card.save();
      const getImage = (await productImageModel.findAll({ where: { url: req.body.imageUrl } }))[0];
      if (!req.body.image) {
        return res.status(200).json({ ...card.toJSON(), images: getImage || [] });
      }

      let image = null;
      if (getImage) {
        getImage.url = await updateImage(req.body.image, getImage.url);
        await getImage.save();
        image = getImage;

        console.log("image updated", { images: image });
      }
      if (!getImage) {
        const uploadNewImage = await uploadImage(req.body.image);
        const newImage = await productImageModel.create({ url: uploadNewImage, cardId: card.id });
        image = newImage;
        console.log("imageCreated", newImage);
      }
      res.status(200).json({ ...card.toJSON(), images: image });
    } else {
      res.status(404).send("not found");
    }
  } catch (err) {
    console.log("put router error", err);
  }
});

exports.router = router;
