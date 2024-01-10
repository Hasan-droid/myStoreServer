const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  if (req.body.role === "admin") {
    //here I'am verifying the token that I'am getting from the header to check if the user
    // that creating new admin if he is admin or not
    if (!req.headers.authorization) return res.status(401).json({ msg: "no token, authorization denied" });
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded.role !== "admin") return res.status(401).json({ msg: "you are not admin" });
      if (err) {
        return res.status(401).json({ msg: "token is not valid" });
      }
      next();
    });
  } else {
    next();
  }
};
