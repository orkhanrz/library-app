const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");

const upload = multer({
  dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error("Please upload a jpg, jpeg or png with a size less than 1MB")
      );
    }
    cb(undefined, true);
  },
});

//Login User
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    if (!user) {
      return res.status(403).send("Please provide valid credentials!");
    }

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(403).send({ error });
  }
});

//Remove last token to logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens.pop();
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

//Remove all tokens to logout from all devices
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.send({ error });
  }
});

//Upload Avatar
router.post("/users/me/avatar", upload.single("avatar"), (req, res) => {
  res.send();
});

//Get User Info
router.get("/users/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch {
    res.status(500).send({ error });
  }
});

//Create User
router.post("/users", async (req, res) => {
  try {
    const user = await new User(req.body);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(500).send({ error });
  }
});

//Delete User
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send({ error });
  }
});

//Update User
router.patch("/users/me", auth, async (req, res) => {
  const allowedUpdates = ["name", "email", "password"];
  const updates = Object.keys(req.body);
  const isAllowed = updates.every((update) => allowedUpdates.includes(update));

  if (!isAllowed) {
    return res.status(403).send({ error: "Invalid operation!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
