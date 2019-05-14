const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true
  },
  password: {
   type: String,
   required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('user', UserSchema);