const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  console.log("req.body", req.headers.authorization);
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      console.log("decoded", decoded);
      req.userData = decoded;
      if (err) {
        return res.status(401).json({ msg: "token is not valid" });
      }
      next();
    });
  } else {
    return res.status(401).json({ msg: "no token, authorization denied" });
  }
};
