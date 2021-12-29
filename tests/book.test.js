const app = require("../src/app");
const request = require("supertest");
const Book = require("../src/models/book");
const {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  setupDatabase,
  bookOne,
  bookTwo,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create book for user", async () => {
  const response = await request(app)
    .post("/books")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      title: "The Zahir",
      author: "Paulo Coelho",
    })
    .expect(201);

  const book = await Book.findById(response.body._id);
  expect(book).not.toBe(null);
  expect(book.completed).toBe(false);
});

test("Should fetch user books", async () => {
  const response = await request(app)
    .get("/books")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});

test("Should not delete book for second user", async () => {
  const response = await request(app)
    .delete(`/books/${bookOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const book = await Book.findById(bookOne._id);
  expect(book).not.toBe(null);
});
