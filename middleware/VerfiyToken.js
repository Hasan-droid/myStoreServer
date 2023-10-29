const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  console.log("req.headers", req.headers.authorization);
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      console.log("decoded", decoded);
      if (decoded.role !== "admin")
        return res.status(401).json({ msg: "you are not authorized to access this route" });
      req.userData = decoded;
      if (err) {
        return res.status(401).json({ msg: "token is not valid: ", err });
      }
      next();
    });
  } else {
    return res.status(401).json({ msg: "no token, authorization denied" });
  }
};
