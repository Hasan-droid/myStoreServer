const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const ip = process.env.IP || "";
const path = require("path");
const db = require("./model").sequelize;
const cardRouter = require("./routes/card.route");
const cartRouter = require("./routes/cart.route");
const userRouter = require("./routes/user.route");
const inboxRouter = require("./routes/inbox.route");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = {
  origin: process.env.CLIENT_URL,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
//set the server to recive multipart/form-data (file) and json
// app.options("*", cors(corsOptions));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/api", require("./routes/members"));
app.use("/gallery", cardRouter.router);
app.use("/cart", cartRouter.router);
app.use("/user", userRouter.router);
app.use("/inbox", inboxRouter.router);
//catch the route that not exist
app.use((req, res, next) => {
  res.status(404).send("not found");
});
app.get("/", (req, res) => {
  res.json("{set:hey this is get route}");
});

db.sync({ force: false })
  .then(() => {
    app.listen(port, ip, () => {
      console.log(`server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
