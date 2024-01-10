const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { userModel } = require("../model");
const VerfiySignUpToken = require("../middleware/verfiySignUpToken");
const jwt = require("jsonwebtoken");
const verfiyAdmin = require("../middleware/VerfiyAdminToken");
const crypto = require("crypto");
const sendVerificationEmail = require("../js/sendVerificationEmail");

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
  setTimeout(async () => {
    if (!req.body.firstname || !req.body.lastname || !req.body.username || !req.body.password)
      return res.status(400).send({ message: "all fields are required" });
    const verificationToken = crypto.randomBytes(20).toString("hex");
    req.body.verificationToken = verificationToken;
    req.body.verifiedUser = false;
    console.log("the body", body);
    const newUser = await userModel.create(req.body);
    // const token = jwt.sign(
    //   { role: newUser.role, email: newUser.username, name: `${newUser.firstname} ${newUser.lastname}` },
    //   process.env.SECRET_KEY,
    //   {
    //     expiresIn: "2h",
    //   }
    // );
    if (!req.body.role) {
      //no role in the request body because the "user" role value is
      //the default value from user model
      sendVerificationEmail(newUser.username, verificationToken);
    }
    return res.status(200).json({ message: "sign up successful" });
  }, 2000);
});

router.put("/update", verfiyAdmin, async (req, res) => {
  const { oldname, newname } = req.body;
  userModel
    .update({ username: newname }, { where: { username: oldname } })
    .then((result) => {
      res.status(200).json({ message: `updated: new username is ${newname}` });
    })
    .catch((err) => {
      res.status(400).json({ message: "not updated" });
    });
});

router.get("/verify", async (req, res) => {
  debugger;
  const { email, token } = req.query;
  const user = await userModel.findOne({ where: { username: email } });
  if (!user) return res.status(404).send("user not found");
  if (user.verificationToken === token) {
    user.verifiedUser = true;
    user.save();
    // return res.status(200).send("user verified");
    //if user verified redirect to the sigin page and send success message
    return res.status(200).redirect(`${process.env.CLIENT_URL}/signin?verified=true`);
  }
  return res.status(500).redirect(`${process.env.CLIENT_URL}/signin?verified=false`);
});

router.post("/signin", async (req, res) => {
  console.log(" the body", req.body);
  const { password, username } = req.body;

  setTimeout(async () => {
    if (!password) return res.status(400).send({ filed: "password", message: "this filed is required" });
    if (!username) return res.status(400).send({ filed: "username", message: "this filed is required" });
    const user = await userModel.findOne({ where: { username } });
    if (!user) return res.status(404).send("Incorrect username or password");
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(404).send("Incorrect username or password");
    if (!user.verifiedUser) return res.status(401).send("please verify your email");
    if (res.status(200)) {
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
});

exports.router = router;
