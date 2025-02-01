const { User } = require("../models");
const { decodeAccessToken } = require("../utils");

module.exports = async (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = bearerToken.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = await decodeAccessToken(token);
    const user = await User.findOne({
      where: { id: decoded.id, token: token },
    });

    if (!user) {
      throw new Error("Invalid token");
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
