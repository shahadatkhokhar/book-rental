const express = require("express");
const {
  searchBooks,
  getMostPopularBook,
  getMostOverdueBook,
} = require("../controllers/book.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/search", auth, searchBooks);
router.get("/popular", auth, getMostPopularBook);
router.get("/overdue", auth, getMostOverdueBook);

module.exports = router;
