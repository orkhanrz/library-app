const express = require("express");
const app = express();
const userRouter = require("./routers/user");
const bookRouter = require("./routers/book");
require("./db/mongoose");

const port = process.env.PORT;
app.use(express.json());
app.use(userRouter);
app.use(bookRouter);

app.listen(port, () => {
  console.log(`App runs on port: ${port}`);
});
