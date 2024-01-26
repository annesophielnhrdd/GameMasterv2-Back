var express = require('express');
var router = express.Router();
const Story = require('../models/Story');
const User = require('../models/User');

/* Save a new story. (save the story in stories collection & save datas in inProgressStories of gameMaster user db) */
router.post('/', async (req, res) => {
  const { token, gameMaster, players, title, turn, playerTurn, context } =
    req.body;
  const lastTimePlayed = new Date();

  // Check user token
  const user = await User.findOne({ token });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Save story to DB
  try {
    savedStory = await Story.create({
      gameMaster,
      players,
      title,
      lastTimePlayed,
      turn,
      playerTurn,
      context,
    });

    // Add story to user's in progress stories list
    if (savedStory) {
      await User.updateOne(
        { token },
        {
          $push: {
            inProgressStrories: {
              title,
              lastTimePlayed,
              story: savedStory._id,
            },
          },
        }
      );
    }
  } catch (error) {
    // Log & return error message
    console.error('[BACKEND] DB saving story error', error);
    return res.status(400).json({ error });
  }
});

/* Get stories by user token. */
router.get('/stories/:token', (req, res) => {});

/* Get story by id. */
router.get('/story/:id', (req, res) => {});

module.exports = router;
