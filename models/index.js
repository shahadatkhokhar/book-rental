const sequelize = require("../config/db.config");
const User = require("./user.model");
const Book = require("./book.model");
const Rental = require("./rental.model");

// Synchronize models with database
sequelize
  .sync()
  .then(() => console.log("Database & tables created!"))
  .catch((err) => console.error("Database sync error:", err));

module.exports = { sequelize, User, Book, Rental };
