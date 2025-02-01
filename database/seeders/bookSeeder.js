const Book = require("../../models/book.model");

const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    genre: "Classics",
    // ...other fields...
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780060935467",
    genre: "Classics",
    // ...other fields...
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    genre: "Dystopian",
    // ...other fields...
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780141199078",
    genre: "Romance",
    // ...other fields...
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "9780316769488",
    genre: "Classics",
    // ...other fields...
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "9780547928227",
    genre: "Fantasy",
    // ...other fields...
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    isbn: "9781451673319",
    genre: "Science Fiction",
    // ...other fields...
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    isbn: "9780375842207",
    genre: "Historical Fiction",
    // ...other fields...
  },
  {
    title: "Moby-Dick",
    author: "Herman Melville",
    isbn: "9781503280786",
    genre: "Classics",
    // ...other fields...
  },
  {
    title: "War and Peace",
    author: "Leo Tolstoy",
    isbn: "9781400079988",
    genre: "Historical Fiction",
    // ...other fields...
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Book.bulkCreate(books, { validate: true });
  },

  down: async (queryInterface, Sequelize) => {
    await Book.destroy({ where: {}, truncate: true });
  },
};
