module.exports = (req, res, next) => {
  try {
    const enumValues = ["waterSpaces", "candles"];
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
