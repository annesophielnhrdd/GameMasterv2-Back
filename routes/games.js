var express = require("express");
var router = express.Router();
const Story = require("../models/Game");
const User = require("../models/User");

/* CREATE a new game. (create the game in games collection)
Request body: 
  token: user's token, 
  gameMaster: username, 
  players: payers datas array [{index, name, character desciption}], 
  title: story's title,
  universe: 'montagne' or 'forêt' or 'ville', 
  storyLength: 5 or 10 or 15 or 20 or 25 or 30,
  style: 'combat' or 'intrigue' or 'exploration',
  context: [summary of the story's phases]. */
router.post("/", async (req, res) => {
  const {
    token,
    gameMaster,
    players,
    charactersDescription,
    title,
    universe,
    storyLength,
    style,
    context,
    choices,
  } = req.body;
  const lastTimePlayed = new Date();

  // Check user token
  const user = await User.findOne({ token });

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  // Check if story's title already exists
  let newtitle;
  titleExists = await Story.find({ title: { $regex: title } });
  if (titleExists.length === 0) {
    newtitle = title;
  } else {
    newtitle = title + ` #${titleExists.length + 1}`;
  }

  // Save story to DB
  try {
    createdStory = await Story.create({
      gameMaster,
      players,
      charactersDescription,
      title: newtitle,
      universe,
      storyLength,
      style,
      lastTimePlayed,
      round: 0,
      playerTurn: 0,
      context,
      choices,
    });

    console.log("[BACKEND] DB created story:", createdStory);
    return res.json(createdStory);
  } catch (error) {
    // Log & return error message
    console.error("[BACKEND] DB create story error:", error);
    return res.status(400).json({ error });
  }
});

/* GET games by user token. */
router.get("/all/:token", (req, res) => {});

/* GET game by id. */
router.get("/:id", (req, res) => {
  Story.findById(req.params.id)
    .then(story => res.json(story))
    .catch(error => res.status(400).json({ error }));
});

module.exports = router;
