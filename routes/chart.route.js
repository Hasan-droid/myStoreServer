const express = require("express");
const router = express.Router();
const { chartModel } = require("../model");

router.get("/", async (req, res) => {
  const charts = await chartModel.findAll();
  if (charts) {
    return res.json(charts);
  }
  return 0;
});

router.post("/", async (req, res) => {
  console.log("req.body", req.body);

  const chart = await chartModel.create(req.body);
  console.log("req.body1111111", req.body);
  res.json(chart);
});

exports.router = router;
