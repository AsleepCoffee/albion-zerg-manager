const mongoose = require('mongoose');

const CompSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slots: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model('Comp', CompSchema);
