var express = require('express');
var router = express.Router();
const Story = require('../models/Story');
const User = require('../models/User');
const {
  storyBeginningCreation,
  continueStory,
  charactersCreation,
  summaryLastPhase,
} = require('../openAI/openAI');

/* GET player's characters. 
Request query params: players names separate with coma. */
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

/* GET story's beginning.
Request query params: 
  charactersDescription: one string of all characters names and description, 
  univers: 'montagne' or 'forêt' or 'ville', 
  storyLength: 5 or 10 or 15 or 20 or 25 or 30, 
  style: 'combat' or 'intrigue' or 'exploration'. */
router.get('/beginning', async (req, res) => {
  const { charactersDescription, univers, storyLength, round, style } =
    req.query;
  // console.log('charactersDescription:', charactersDescription);
  // console.log('univers:', univers);
  // console.log('storyLength:', storyLength);
  // console.log('style:', style);

  try {
    const storyBeginning = await storyBeginningCreation(
      charactersDescription,
      univers,
      storyLength,
      round,
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

/* CREATE a new story. (create the story in stories collection)
Request body: 
  token: user's token, 
  gameMaster: username, 
  players: payers datas array [{index, name, character desciption}], 
  title: story's title,
  univers: 'montagne' or 'forêt' or 'ville', 
  storyLength: 5 or 10 or 15 or 20 or 25 or 30,
  style: 'combat' or 'intrigue' or 'exploration',
  context: [summary of the story' phases]. */
router.post('/', async (req, res) => {
  const {
    token,
    gameMaster,
    players,
    title,
    univers,
    storyLength,
    style,
    context,
  } = req.body;
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
      univers,
      storyLength,
      style,
      lastTimePlayed,
      round: 0,
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

/* GET story's summary.
Request query params: 
  context: summary of the story, 
  charactersDescription: one string of all characters names and description, 
  univers: 'montagne' or 'forêt' or 'ville', 
  storyLength: 5 or 10 or 15 or 20 or 25 or 30, 
  round: number of the current round,
  style: 'combat' or 'intrigue' or 'exploration'. */
router.get('/summary', async (req, res) => {
  const {
    context,
    charactersDescription,
    lastChoises,
    storyLength,
    round,
    style,
  } = req.query;
  // console.log('charactersDescription:', charactersDescription);
  // console.log('univers:', univers);
  // console.log('storyLength:', storyLength);
  // console.log('style:', style);

  try {
    const storySummary = await summaryLastPhase(
      context,
      charactersDescription,
      lastChoises,
      storyLength,
      round,
      style
    );

    console.log("[BACKEND][STORIES] created story's summary:", storySummary);
    res.json(storySummary);
  } catch (error) {
    console.error("[BACKEND][STORIES] create story's summary error:", error);
    res.status(400).json({ error });
  }
});

/* PUT story's continuation.
Request body: 
  context: summary of the story, 
  charactersDescription: one string of all characters names and description, 
  lastChoices: last choises for all the characters, 
  storyLength: 5 or 10 or 15 or 20 or 25 or 30,
  round: number of the current round,
  style: 'combat' or 'intrigue' or 'exploration'. */
router.put('/continuation', async (req, res) => {
  const { context, charactersDescription, storyLength, round, style } =
    req.body;
  // console.log('context:', context);
  // console.log('charactersDescription:', charactersDescription);
  // console.log('lastChoises:', lastChoises);
  // console.log('storyLength:', storyLength);
  // console.log('round:', round);
  // console.log('style:', style);

  try {
    const storyContinuation = await continueStory(
      context,
      charactersDescription,
      storyLength,
      round,
      style
    );

    console.log(
      "[BACKEND][STORIES] added story's continuation:",
      storyContinuation
    );
    res.json(storyContinuation);
  } catch (error) {
    console.error("[BACKEND][STORIES] add story's continuation error:", error);
    res.status(400).json({ error });
  }
});

/* GET stories by user token. */
router.get('/stories/:token', (req, res) => {});

/* GET story by id. */
router.get('/story/:id', (req, res) => {});

module.exports = router;
