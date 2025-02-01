const Rental = require("../models/rental.model");
const Book = require("../models/book.model");
const User = require("../models/user.model");
const { decodeAccessToken } = require("../utils");

exports.rentBook = async (req, res) => {
  try {
    let decodedToken = decodeAccessToken(req.headers.authorization);
    const user_id = decodedToken.id;
    const { book_id } = req.body;

    // Check if the book is already rented by the user
    const existingRental = await Rental.findOne({
      where: { user_id, book_id, returned_at: null },
    });

    if (existingRental) {
      return res
        .status(400)
        .json({ error: "Book is already rented by the user" });
    }

    const due_at = new Date();
    due_at.setDate(due_at.getDate() + 14);

    const rental = await Rental.create({
      user_id,
      book_id,
      rented_at: new Date(),
      due_at,
    });
    res.status(201).json(rental);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error renting book" });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findByPk(id);

    if (!rental)
      return res.status(404).json({ error: "Rental record not found" });

    rental.returned_at = new Date();
    rental.is_overdue = rental.due_at < new Date();
    await rental.save();

    res.json({ message: "Book returned successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error returning book" });
  }
};

exports.rentalHistory = async (req, res) => {
  try {
    let decodedToken = decodeAccessToken(req.headers.authorization);
    const history = await Rental.findAll({
      where: { user_id: decodedToken.id },
      include: [{ model: Book }, { model: User }],
      order: [["rented_at", "DESC"]],
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Error fetching rental history" });
  }
};
