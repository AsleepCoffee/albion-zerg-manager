const mongoose = require('mongoose');

const signUpSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: true },
  firstPick: { type: String, required: true },
  secondPick: { type: String },
  thirdPick: { type: String },
});

module.exports = mongoose.model('SignUp', signUpSchema);
