const express = require("express");
const {
  rentBook,
  returnBook,
  rentalHistory,
} = require("../controllers/rental.controller");

const router = express.Router();

router.post("/rent", rentBook);
router.post("/return/:id", returnBook);
router.get("/history", rentalHistory);

module.exports = router;
