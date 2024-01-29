var express = require('express');
var router = express.Router();
const Story = require('../models/Story');
const User = require('../models/User');
const {
  charactersCreation,
  storyBeginningCreation,
} = require('../openAi/openAi');

/* Create player's characters. */
router.get('/characters/', async (req, res) => {
  const players = req.query.players;
  // console.log('players:', players);

  try {
    const createdCharacters = await charactersCreation(players);

    console.log('[BACKEND][STORIES] created characters:', createdCharacters);
    res.json(createdCharacters);
  } catch (error) {
    console.error('[BACKEND][STORIES] create characters error:', error);
    res.status(400).json({ error });
  }
});

/* Create story's beginning. */
router.get('/beginning', async (req, res) => {
  const { charactersDescription, univers, storyLength, style } = req.query;
  // console.log('charactersDescription:', charactersDescription);
  // console.log('univers:', univers);
  // console.log('storyLength:', storyLength);
  // console.log('style:', style);

  try {
    const storyBeginning = await storyBeginningCreation(
      charactersDescription,
      univers,
      storyLength,
      style
    );

    console.log(
      "[BACKEND][STORIES] created story's beginning:",
      storyBeginning
    );
    res.json(storyBeginning);
  } catch (error) {
    console.error("[BACKEND][STORIES] create story's beginning error:", error);
    res.status(400).json({ error });
  }
});

/* Create a new story. (create the story in stories collection) */
router.post('/', async (req, res) => {
  const { token, gameMaster, players, title, context } = req.body;
  const lastTimePlayed = new Date();

  // Check user token
  const user = await User.findOne({ token });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
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
      title: newtitle,
      lastTimePlayed,
      turn: 0,
      playerTurn: 0,
      context,
    });

    console.log('[BACKEND] DB created story:', createdStory);
    return res.json({ createdStory });
  } catch (error) {
    // Log & return error message
    console.error('[BACKEND] DB create story error:', error);
    return res.status(400).json({ error });
  }
});

/* Get stories by user token. */
router.get('/stories/:token', (req, res) => {});

/* Get story by id. */
router.get('/story/:id', (req, res) => {});

module.exports = router;
