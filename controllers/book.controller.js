const { Op } = require("sequelize");
const Book = require("../models/book.model");
const Rental = require("../models/rental.model");
const sequelize = require("../config/db.config");

exports.searchBooks = async (req, res) => {
  try {
    filter = {};

    if (req.query.title) {
      filter.title = { [Op.like]: `%${req.query.title}%` };
    }

    if (req.query.genre) {
      filter.genre = req.query.genre;
    }

    const books = await Book.findAll({ where: filter });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Error searching books" });
  }
};

exports.getMostPopularBook = async (req, res) => {
  try {
    const popularBook = await Rental.findAll({
      attributes: [
        "book_id",
        [sequelize.fn("COUNT", sequelize.col("book_id")), "rental_count"],
      ],
      group: ["book_id"],
      order: [[sequelize.literal("rental_count"), "DESC"]],
      limit: 1,
      include: [{ model: Book }],
    });

    if (!popularBook.length)
      return res.json({ message: "No books rented yet" });

    res.json(popularBook[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching most popular book" });
  }
};

exports.getMostOverdueBook = async (req, res) => {
  try {
    const overdueBook = await Rental.findAll({
      attributes: [
        "book_id",
        [sequelize.fn("COUNT", sequelize.col("book_id")), "overdue_count"],
      ],
      where: { is_overdue: true },
      group: ["book_id"],
      order: [[sequelize.literal("overdue_count"), "DESC"]],
      limit: 1,
      include: [{ model: Book }],
    });

    if (!overdueBook.length) return res.json({ message: "No overdue books" });

    res.json(overdueBook[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching most overdue book" });
  }
};
