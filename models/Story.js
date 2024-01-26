import { Schema, model } from 'mongoose';

const playerSchema = Schema({
  // Sub-document
  index: Number,
  name: String,
  character: String,
});

const storiesSchema = Schema(
  {
    // Main Schema
    gameMaster: { type: Schema.Types.ObjectId, ref: 'User' }, // Foreign key
    players: [playerSchema],
    title: String,
    lastTimePlayed: Date,
    turn: Number,
    playerTurn: Number,
    context: [String],
  },
  { collection: 'stories' }
);

const Story = model('Story', storiesSchema);

export default Story;
