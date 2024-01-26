import { Schema, model } from 'mongoose';

const inProgressStroriesSchema = Schema({
  // Sub-document
  title: String,
  lastTimePlayed: Date,
  story: { type: Schema.Types.ObjectId, ref: 'Story' }, // Foreign key
});

const userSchema = Schema(
  {
    username: String,
    password: String,
    token: String,
    friends: [String],
    inProgressStrories: [inProgressStroriesSchema],
  },
  { collection: 'users' }
);

const User = model('User', userSchema);

export default User;
