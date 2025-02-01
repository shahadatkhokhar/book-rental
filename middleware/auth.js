const { User } = require("../models");
const { decodeAccessToken } = require("../utils");

module.exports = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  console.log(bearerToken, "sdf");
  if (!bearerToken) {
    console.log("no token");
    return res.status(401).json({ message: "No token provided" });
  }

  if (!bearerToken) {
    console.log("invalud token");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = decodeAccessToken(bearerToken);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
