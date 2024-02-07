const mongoose = require("mongoose");

const playerSchema = mongoose.Schema({
  // Sub-document
  index: Number,
  name: String,
  character: String,
  desciption: String,
});

const choicesSchema = mongoose.Schema({
  // Sub-document
  character: String,
  choices: [String],
});

const selectedChoicesSchema = mongoose.Schema({
  // Sub-document
  character: String,
  choise: String,
});

const gameSchema = mongoose.Schema(
  {
    // Main Schema
    gameMaster: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Foreign key
    players: [playerSchema],
    charactersDescription: String,
    title: String,
    universe: String,
    style: String,
    storyLength: Number,
    lastTimePlayed: Date,
    round: Number,
    playerTurn: Number,
    context: [String],
    choices: [choicesSchema],
    selectedChoices: [selectedChoicesSchema],
  },
  { collection: "games" }
);

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
