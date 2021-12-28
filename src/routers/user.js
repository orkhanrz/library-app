const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendSignupMail, sendDeletionMail } = require("../emails/account");

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error("Please upload a jpg, jpeg or png with a size less than 1MB.")
      );
    }
    cb(undefined, true);
  },
});

//Create User
router.post("/users", async (req, res) => {
  try {
    const user = await new User(req.body);
    const token = await user.generateAuthToken();
    sendSignupMail(user.email, user.name);
    res.send({ user, token });
  } catch (error) {
    res.status(500).send({ error });
  }
});

//Delete User
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendDeletionMail(req.user.email, req.user.name);
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

//Logout User
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
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
      })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("No user or avatar found!");
    }

    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

//Get User Info
router.get("/users/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch {
    res.status(500).send({ error });
  }
});

module.exports = router;
