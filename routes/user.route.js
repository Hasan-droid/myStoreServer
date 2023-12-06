const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { userModel } = require("../model");
const VerfiySignUpToken = require("../middleware/verfiySignUpToken");
const jwt = require("jsonwebtoken");
router.post("/signup/admin", async (req, res) => {
  const body = req.body;
  console.log("the body", body);
  const newUser = await userModel.create(req.body);
  const token = jwt.sign({ role: newUser.role }, process.env.SECRET_KEY, { expiresIn: "2h" });
  console.log("the token", token);
  // newUser.token = token;
  // await newUser.save();
  //handle error here
  // console.log("//////////////NEW User", newUser);
  return res.status(200).json({ token });
});
router.post("/signup", VerfiySignUpToken, async (req, res) => {
  const body = req.body;
  console.log("the body", body);
  setTimeout(async () => {
    if (!req.body.firstname || !req.body.lastname || !req.body.username || !req.body.password)
      return res.status(400).send({ message: "all fields are required" });
    const newUser = await userModel.create(req.body);
    const token = jwt.sign(
      { role: newUser.role, email: newUser.username, name: `${newUser.firstname} ${newUser.lastname}` },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    console.log("the token", token);
    // newUser.token = token;
    // await newUser.save();
    //handle error here
    // console.log("//////////////NEW User", newUser);
    return res.status(200).json({ token });
  }, 2000);
});

router.post("/signin", async (req, res) => {
  console.log(" the body", req.body);
  const { password, username } = req.body;

  setTimeout(async () => {
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
      const token = jwt.sign(
        { role: user.role, email: user.username, name: `${user.firstname} ${user.lastname}` },
        process.env.SECRET_KEY,
        {
          expiresIn: process.env.TOKEN_EXPIRY,
        }
      );
      const userLoggedIn = { token };
      //add token to the header
      res.header("Authorization", token);
      console.log("user logged In");
      return res.status(200).json(userLoggedIn);
    }
  }, 2000);
  //handle error here
  // console.log("//////////////NEW User", newUser);
});

exports.router = router;
