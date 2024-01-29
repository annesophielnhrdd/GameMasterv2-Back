const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: String,
    password: String,
    token: String,
    friends: [String],
  },
  { collection: 'users' }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
