const express = require("express");
const userRouter = require("./routers/user");
const bookRouter = require("./routers/book");
require("./db/mongoose");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(bookRouter);

module.exports = app;
