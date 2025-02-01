const request = require("supertest");
const app = require("../server");
const { User, Book, Rental } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { faker } = require("@faker-js/faker"); // Updated import

let token;
let testUser;
let testBook;
let testUserPassword;
let authHeader;
let userOBJ = {
  name: "Test User",
  password: bcrypt.hashSync("Password@123", 10),
  email: "testuser@gmail.com",
};

beforeAll(async () => {
  testUserPassword = "5uperStrongPassword@123";

  const res = await request(app).post("/api/auth/register").send({
    name: faker.internet.username(), // before version 9.1.0, use userName()
    email: faker.internet.email(),
    password: testUserPassword,
    password_confirmation: testUserPassword,
  });

  testBook = await Book.create({
    title: faker.lorem.words(),
    author: faker.internet.username(),
    isbn: faker.string.uuid(),
    genre: faker.lorem.word(),
  });
  testUser = res.body.user;
  const loginRes = await request(app).post("/api/auth/login").send({
    email: testUser.email, // Use the email of the created test user
    password: testUserPassword,
  });
  authHeader = `Bearer ${loginRes.body.token}`;
});
// afterEach(async () => {
//   console.log(testUser.id);
//   await User.destroy({ where: { id: testUser.id } });
// });

// 📌 **Auth Routes Tests**
describe("Auth Routes", () => {
  it("can register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: faker.internet.username(), // before version 9.1.0, use userName()
      email: faker.internet.email(),
      password: "5uperStrongPassword@123",
      password_confirmation: "5uperStrongPassword@123",
    });

    expect(res.status).toBe(201);
  });

  it("cannot register a user with invalid data", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "",
      email: "invalid-email",
      password: "pass",
      password_confirmation: "different",
    });

    expect(res.status).toBe(422);
  });

  it("can login a user", async () => {
    console.log({
      email: testUser.email, // Use the email of the created test user
      password: testUserPassword,
    });
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email, // Use the email of the created test user
      password: testUserPassword,
    });
    authHeader = `Bearer ${res.body.token}`;

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("cannot login with invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "Wrong@124",
    });

    expect(res.status).toBe(422);
  });
});

// 📌 **Book Rental Routes Tests**
describe("Book Rental Routes", () => {
  it("can search books by title", async () => {
    console.log(authHeader, "ssdfugihbjknlhjgcfxhjk");
    const res = await request(app)
      .get(`/api/books/search?title=Great`)
      .set("Authorization", authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("can search books by genre", async () => {
    const res = await request(app)
      .get("/api/books/search?query=Romance")
      .set("Authorization", authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("can rent a book", async () => {
    console.log(testBook.id);
    const res = await request(app)
      .post("/api/rentals/rent")
      .send({ book_id: testBook.id })
      .set("Authorization", authHeader);

    expect(res.status).toBe(201);
  });

  it("cannot rent a book that is already rented", async () => {
    const due_at = new Date();
    const rental = await Rental.create({
      user_id: testUser.id,
      book_id: testBook.id,
      rented_at: new Date(),
      due_at,
    });

    const res = await request(app)
      .post("/api/rentals/rent")
      .send({ book_id: rental.book_id })
      .set("Authorization", authHeader);

    expect(res.status).toBe(400);
  });

  it("can return a book", async () => {
    const due_at = new Date();
    const rental = await Rental.create({
      user_id: testUser.id,
      book_id: testBook.id,
      rented_at: new Date(),
      due_at,
    });

    const res = await request(app)
      .post(`/api/rentals/return/${rental.id}`)
      .set("Authorization", authHeader);

    expect(res.status).toBe(200);
  });

  it("can get rental history", async () => {
    const due_at = new Date();
    due_at.setDate(due_at.getDate() + 14);
    await Rental.bulkCreate([
      {
        user_id: testUser.id,
        book_id: testBook.id,
        rented_at: new Date(),
        due_at,
      },
      {
        user_id: testUser.id,
        book_id: testBook.id,
        rented_at: new Date(),
        due_at,
      },
      {
        user_id: testUser.id,
        book_id: testBook.id,
        rented_at: new Date(),
        due_at,
      },
    ]);

    const res = await request(app)
      .get("/api/rentals/history")
      .set("Authorization", authHeader);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });

  it("can get the most popular book", async () => {
    const res = await request(app)
      .get("/api/books/popular")
      .set("Authorization", authHeader);

    expect(res.status).toBe(200);
  });

  it("can get the most overdue book", async () => {
    const res = await request(app)
      .get("/api/books/overdue")
      .set("Authorization", authHeader);

    expect(res.status).toBe(200);
  });
});

// 📌 **Protected Routes Tests**
describe("Protected Routes", () => {
  it("can get authenticated user", async () => {
    const res = await request(app)
      .get("/api/auth/user")
      .set("Authorization", authHeader);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("id", testUser.id);
  });

  console.log(authHeader, "sssdfa");
  it("can logout a user", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", authHeader);

    expect(res.status).toBe(200);
  });
});
