const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const ip = process.env.IP || "";
const path = require("path");
const db = require("./model").sequelize;
const cardRouter = require("./routes/card.route");
const chartRouter = require("./routes/chart.route");
const userRouter = require("./routes/user.route");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
//set the server to recive multipart/form-data (file) and json
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/api", require("./routes/members"));
app.use("/gallery", cardRouter.router);
app.use("/charts", chartRouter.router);
app.use("/user", userRouter.router);
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
