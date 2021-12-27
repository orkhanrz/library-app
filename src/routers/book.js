const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const Book = require("../models/book");

router.post("/books", auth, async (req, res) => {
  try {
    const book = new Book({ ...req.body, owner: req.user._id });
    await book.save();
    res.send(book);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.get("/books", auth, async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user._id });

    res.send(books);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.get("/books/:id", auth, async (req, res) => {
  try {
    const book = await Book.findOne({
      owner: req.user._id,
      _id: req.params.id,
    });
    if (!book) {
      return res.status(404).send({ error: "Book not found!" });
    }

    res.send(book);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.delete("/books/:id", auth, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!book) {
      return res.status(404).send({ error: "Book not found!" });
    }

    res.send(book);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.patch("/books/:id", auth, async (req, res) => {
  const allowedUpdates = ["title", "author", "completed"];
  const updates = Object.keys(req.body);
  const isAllowed = updates.every((update) => allowedUpdates.includes(update));

  if (!isAllowed) {
    return res.status().send({ error: "" });
  }

  try {
    const book = await Book.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!book) {
      return res.status(404).send({ error: "Book not found!" });
    }

    updates.forEach((update) => (book[update] = req.body[update]));
    await book.save();
    res.send(book);
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
