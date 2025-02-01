const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Book = sequelize.define(
  "book",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    isbn: { type: DataTypes.STRING, allowNull: false, unique: true },
    genre: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: true }
);

module.exports = Book;
