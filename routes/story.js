var express = require("express");
var router = express.Router();
const Story = require("../models/Game");
const User = require("../models/User");
const {
  storyBeginningCreation,
  continueStory,
  charactersCreation,
  summaryLastPhase,
} = require("../openAI/openAI");

/* GET player's characters. 
Request query params: players names separate with coma. */
router.get("/characters/", async (req, res) => {
  const players = req.query.players;
  // console.log('players:', players);

  try {
    const createdCharacters = await charactersCreation(players);

    console.log("[BACKEND][STORIES] created characters:", createdCharacters);
    res.json(createdCharacters);
  } catch (error) {
    console.error("[BACKEND][STORIES] create characters error:", error);
    res.status(400).json({ error });
  }
});

/* GET story's beginning.
Request query params: 
  charactersDescription: one string of all characters names and description, 
  universe: 'montagne' or 'forêt' or 'ville', 
  storyLength: 5 or 10 or 15 or 20 or 25 or 30, 
  style: 'combat' or 'intrigue' or 'exploration'. */
router.get("/beginning", async (req, res) => {
  const { charactersDescription, universe, storyLength, round, style } =
    req.query;
  // console.log('charactersDescription:', charactersDescription);
  // console.log('universe:', universe);
  // console.log('storyLength:', storyLength);
  // console.log('style:', style);

  try {
    const storyBeginning = await storyBeginningCreation(
      charactersDescription,
      universe,
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

/* GET story's summary.
Request query params: 
  context: summary of the story, 
  charactersDescription: one string of all characters names and description, 
  universe: 'montagne' or 'forêt' or 'ville', 
  storyLength: 5 or 10 or 15 or 20 or 25 or 30, 
  round: number of the current round,
  style: 'combat' or 'intrigue' or 'exploration'. */
router.get("/summary", async (req, res) => {
  const {
    context,
    charactersDescription,
    lastChoises,
    storyLength,
    round,
    style,
  } = req.query;
  // console.log('charactersDescription:', charactersDescription);
  // console.log('universe:', universe);
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
router.put("/continuation", async (req, res) => {
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

module.exports = router;
