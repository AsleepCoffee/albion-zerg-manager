const express = require('express');
const router = express.Router();
const SignUp = require('../models/SignUp');
const Event = require('../models/Event');

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
  
  try {
    // Validate required fields
    if (!eventId || !name) {
      return res.status(400).json({ message: 'eventId and name are required fields' });
    }

    // Create new signup object
    const newSignup = new SignUp({
      eventId,
      name,
      firstPick: firstPick === 'BLANK' ? null : firstPick,
      secondPick: secondPick === 'BLANK' ? null : secondPick,
      thirdPick: thirdPick === 'BLANK' ? null : thirdPick,
    });

    // Save the signup to the database
    const savedSignup = await newSignup.save();

    res.status(201).json(savedSignup);
  } catch (err) {
    console.error('Error creating signup:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a signup by ID
router.delete('/:id', async (req, res) => {
  try {
    const signupId = req.params.id;
    console.log(`Received Signup ID for deletion: ${signupId}`); // Log the signup ID

    // Find the signup first
    const signup = await SignUp.findById(signupId);
    if (!signup) return res.status(404).json({ message: 'Signup not found' });

    // Update the event to remove the assigned role
    const eventId = signup.eventId;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const signupName = signup.name;
    let updated = false;

    console.log(`Assigned Roles before update: ${JSON.stringify(event.assignedRoles, null, 2)}`);

    // Iterate through the assignedRoles and find the role to delete
    for (const party in event.assignedRoles) {
      if (event.assignedRoles.hasOwnProperty(party)) {
        const roles = event.assignedRoles[party];
        for (const role in roles) {
          if (roles.hasOwnProperty(role)) {
            console.log(`Checking role ${role} in party ${party} with assigned ${JSON.stringify(roles[role])}`);
            if (roles[role] && roles[role].name === signupName) {
              console.log(`Removing role ${role} for party ${party}`);
              delete event.assignedRoles[party][role];
              updated = true;
            }
          }
        }
      }
    }

    if (updated) {
      console.log('Saving updated event roles');
      await event.save();
      console.log('Event roles updated successfully');
    } else {
      console.log('No assigned role found to update');
    }

    // Delete the signup
    await SignUp.findByIdAndDelete(signupId);

    res.json({ message: 'Signup deleted and event updated successfully' });
  } catch (err) {
    console.error('Error deleting signup:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
