const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Book = require("../../src/models/book");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Babek",
  email: "babekrzali@mail.ru",
  password: "Babek23",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Orkhan",
  email: "orkhanrzali@mail.ru",
  password: "Orkhan23",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const bookOne = {
  _id: mongoose.Types.ObjectId(),
  title: "The Zahir",
  author: "Paulo Coelho",
  completed: false,
  owner: userOneId,
};

const bookTwo = {
  _id: mongoose.Types.ObjectId(),
  title: "The Alchemist",
  author: "Paulo Coelho",
  completed: true,
  owner: userOneId,
};

const bookThree = {
  _id: mongoose.Types.ObjectId(),
  title: "Parfumer",
  author: "Patrick Suskind",
  completed: true,
  owner: userTwoId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Book.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Book(bookOne).save();
  await new Book(bookTwo).save();
  await new Book(bookThree).save();
};

module.exports = {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  setupDatabase,
  bookOne,
  bookTwo,
};
