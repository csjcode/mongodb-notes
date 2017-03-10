const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  name: String,
  postCount: Number
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
