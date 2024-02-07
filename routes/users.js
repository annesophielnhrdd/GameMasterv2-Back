var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const Story = require("../models/Game");
const User = require("../models/User");

/* SignUp new user. */
router.post("/signup", (req, res) => {});

/* SignIp existing user. */
router.post("/signin", (req, res) => {});

/* Add a friend */
router.post("/addFriends", (req, res) => {
  const { token, newFriends } = req.body;

  User.findOneAndUpdate(
    { token },
    { $addToSet: { friends: newFriends } },
    { returnDocument: "after" }
  ).then(user => {
    if (!user) {
      console.log("error:", error);
      return res.status(400).json({ error: "User not found" });
    } else {
      return res.json({ user: user.username, friends: user.friends });
    }
  });
});

/* Remove a friend */
router.delete("/removeFriend", (req, res) => {
  const { token, friend } = req.body;

  User.findOneAndUpdate(
    { token },
    { $pull: { friends: friend } },
    { returnDocument: "after" }
  ).then(user => {
    if (!user) {
      console.log("error:", error);
      return res.status(400).json({ error: "User not found" });
    } else {
      return res.json({ user: user.username, friends: user.friends });
    }
  });
});

module.exports = router;
