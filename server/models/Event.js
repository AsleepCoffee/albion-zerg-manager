const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
  },
  partyComps: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comp',
    required: true,
  }],
  caller: {
    type: String,
    required: true,
  },
  hammers: {
    type: String,
    required: true,
  },
  sets: {
    type: String,
    required: true,
  },
  rewards: {
    type: String,
    required: true,
  },
  parties: {
    type: Number,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  compSlots: {
    type: [String],
    required: true,
  },
  assignedRoles: {
    type: Map,
    of: Map,
    default: {},
  },
});

module.exports = mongoose.model('Event', EventSchema);
