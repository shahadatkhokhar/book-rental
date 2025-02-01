const express = require("express");
const {
  register,
  login,
  logout,
  getUser,
} = require("../controllers/auth.controller");
const auth = require("../middleware/auth");

const router = express.Router();
router.get("/user", auth, getUser);
router.post("/logout", auth, logout);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
