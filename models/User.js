const mongoose = require('mongoose');

const inProgressStroriesSchema = mongoose.Schema({
  // Sub-document
  title: String,
  lastTimePlayed: Date,
  story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' }, // Foreign key
});

const userSchema = mongoose.Schema(
  {
    username: String,
    password: String,
    token: String,
    friends: [String],
    inProgressStrories: [inProgressStroriesSchema],
  },
  { collection: 'users' }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
