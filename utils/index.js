const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports.decodeAccessToken = (bearerToken, access_for = "") => {
  let [bearer, token] = bearerToken.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.APP_KEY);

    return decoded;
  } catch (e) {
    throw e;
  }
};
