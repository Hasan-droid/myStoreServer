const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { userModel } = require("../model");
const VerfiySignUpToken = require("../middleware/verfiySignUpToken");
const jwt = require("jsonwebtoken");
router.post("/signup", VerfiySignUpToken, async (req, res) => {
  //   const { password } = req.body;
  const newUser = await userModel.create(req.body);
  const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.SECRET_KEY, { expiresIn: "7d" });
  console.log("the token", token);
  // newUser.token = token;
  // await newUser.save();
  //handle error here
  // console.log("//////////////NEW User", newUser);

  res.json({ ...newUser.dataValues, token });
});

router.post("/signin", async (req, res) => {
  console.log(" the body", req.body);
  const { password, username } = req.body;

  if (!password) return res.status(400).send({ filed: "password", message: "this filed is required" });
  if (!username) return res.status(400).send({ filed: "username", message: "this filed is required" });
  const user = await userModel.findOne({ where: { username } });

  if (!user) return res.status(404).send("user not found");

  //   const hashedPassword = await bcrypt.hash(password, 8);
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  //   console.log("the enter pass", hashedPassword);
  if (!user || !isPasswordCorrect) return res.status(401).send("user not found");
  // if (!isPasswordCorrect) return res.status(404).send("password not correct");
  if (res.status(200)) {
    // const userLoggedIn = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1d" });
    const userLoggedIn = { ...user.dataValues, token };

    return res.status(200).json(userLoggedIn);
  }

  //handle error here
  // console.log("//////////////NEW User", newUser);
});

exports.router = router;
