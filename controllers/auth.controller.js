const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { decodeAccessToken } = require("../utils");
require("dotenv").config();

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Log in an existing user and return a JWT token
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.APP_KEY,
      { expiresIn: "1h" }
    );

    // Store token in user record
    user.token = token;
    await user.save({ fields: ["token"] });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Get user details by ID
 */
exports.getUser = async (req, res) => {
  try {
    let decodedToken = decodeAccessToken(req.headers.authorization);
    // Find user by ID
    const id = decodedToken.id;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Log out user (invalidate token on client-side)
 */
exports.logout = async (req, res) => {
  try {
    let decodedToken = decodeAccessToken(req.headers.authorization);
    const user = await User.findByPk(decodedToken.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Invalidate token
    user.token = null;
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
