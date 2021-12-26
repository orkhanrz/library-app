const express = require("express");
const app = express();
const userRouter = require("./routers/user");
require("./db/mongoose");

const port = 3000;
app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
  console.log(`App runs on port: ${port}`);
});
