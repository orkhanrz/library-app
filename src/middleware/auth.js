const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      return res.status(403).send({ error: "Please authorize!" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send();
  }
};

module.exports = auth;
