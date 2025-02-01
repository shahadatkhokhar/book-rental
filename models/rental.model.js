const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const User = require("./user.model");
const Book = require("./book.model");

const Rental = sequelize.define(
  "rental",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rented_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    due_at: { type: DataTypes.DATE },
    is_overdue: { type: DataTypes.BOOLEAN, defaultValue: false },
    returned_at: { type: DataTypes.DATE, allowNull: true },
  },
  { timestamps: true }
);

// Define Relationships
User.hasMany(Rental);
Rental.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

Book.hasMany(Rental);
Rental.belongsTo(Book, { foreignKey: "book_id", onDelete: "CASCADE" });

module.exports = Rental;
