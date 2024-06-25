const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Signup = require('../models/SignUp'); // Ensure this path is correct

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('comp');
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get an event by ID
router.get('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log('Received Event ID:', eventId); // Log received eventId

    const event = await Event.findById(eventId).populate('comp');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('Error fetching event by ID:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  const { time, comp, caller, hammers, sets, rewards, parties, eventType, compSlots, assignedRoles } = req.body;
  const event = new Event({ time, comp, caller, hammers, sets, rewards, parties, eventType, compSlots, assignedRoles });
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Error creating new event:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update an event
router.put('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log('Received Event ID for update:', eventId); // Log received eventId

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete an event and its associated signups
router.delete('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log('Received Event ID for deletion:', eventId); // Log received eventId

    // Delete associated signups
    await Signup.deleteMany({ eventId });

    // Delete the event
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json({ message: 'Event and associated signups deleted' });
  } catch (err) {
    console.error('Error deleting event and signups:', err.message, err);
    res.status(500).json({ message: err.message });
  }
});

// Save role assignments
router.put('/:id/assignments', async (req, res) => {
  try {
    const { assignedRoles } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.assignedRoles = assignedRoles;
    await event.save();
    res.json(event);
  } catch (err) {
    console.error('Error saving role assignments:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
