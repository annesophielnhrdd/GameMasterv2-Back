var express = require('express');
var router = express.Router();
const Story = require('../models/Story');
const User = require('../models/User');

/* Save a new story. (save the story in stories collection & save datas in inProgressStories of gameMaster user db) */
router.post('/', (req, res) => {
  const { token, gameMaster, players, title, turn, playerTurn, context } =
    req.body;
  const lastTimePlayed = new Date();

  Model.create({
    token,
    gameMaster,
    players,
    title,
    lastTimePlayed,
    turn,
    playerTurn,
    context,
  })
    .then(savedStory => {
      res.json({ savedStory });
    })
    .catch(error => res.status(400).json({ error }));
});

/* Get stories by user token. */
router.get('/stories/:token', (req, res) => {});

/* Get story by id. */
router.get('/story/:id', (req, res) => {});

module.exports = router;
