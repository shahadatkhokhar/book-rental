const express = require("express");
const {
  searchBooks,
  getMostPopularBook,
  getMostOverdueBook,
} = require("../controllers/book.controller");

const router = express.Router();

router.get("/search", searchBooks);
router.get("/popular", getMostPopularBook);
router.get("/overdue", getMostOverdueBook);

module.exports = router;
