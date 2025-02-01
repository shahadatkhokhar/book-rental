const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports.decodeAccessToken = (bearerToken) => {
  let [bearer, token] = bearerToken.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded;
  } catch (e) {
    throw e;
  }
};
