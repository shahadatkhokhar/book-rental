const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { sequelize } = require("./models");
const authRoutes = require("./routes/auth.route");
const bookRoutes = require("./routes/book.route");
const rentalRoutes = require("./routes/rental.route");
const { response } = require("./middleware/response");
const authMiddleware = require("./middleware/auth");
require("./config/db.config");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", authMiddleware, bookRoutes);
app.use("/api/rentals", authMiddleware, rentalRoutes);
app.use("/api/*", (req, res) => {
  res.status(401).json({ message: "API not found" });
});
sequelize.sync().then(() => console.log("Database synced!"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Ensure the database connection
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");
  } catch (error) {
    console.error("Database connection error:", error);
  }
});
