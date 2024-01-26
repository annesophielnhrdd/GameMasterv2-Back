const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  // Sub-document
  index: Number,
  name: String,
  character: String,
});

const storiesSchema = mongoose.Schema(
  {
    // Main Schema
    gameMaster: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Foreign key
    players: [playerSchema],
    title: String,
    lastTimePlayed: Date,
    turn: Number,
    playerTurn: Number,
    context: [String],
  },
  { collection: 'stories' }
);

const Story = mongoose.model('Story', storiesSchema);

module.exports = Story;
