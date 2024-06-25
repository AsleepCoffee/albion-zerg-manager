const express = require('express');
const router = express.Router();
const SignUp = require('../models/SignUp'); // Ensure this matches the filename

// Get signups for a specific event
router.get('/:eventId', async (req, res) => {
  try {
    const signups = await SignUp.find({ eventId: req.params.eventId });
    res.json(signups);
  } catch (err) {
    console.error('Error fetching signups:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add a new signup
router.post('/', async (req, res) => {
  const { eventId, name, firstPick, secondPick, thirdPick } = req.body;
  const signup = new SignUp({ eventId, name, firstPick, secondPick, thirdPick });
  try {
    const newSignup = await signup.save();
    res.status(201).json(newSignup);
  } catch (err) {
    console.error('Error creating signup:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
