const express = require('express');
const router = express.Router();
const Comp = require('../models/Comp');

// Get all comps
router.get('/', async (req, res) => {
  try {
    const comps = await Comp.find();
    res.json(comps);
  } catch (err) {
    console.error('Error fetching comps:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a comp by ID
router.get('/:id', async (req, res) => {
  try {
    const compId = req.params.id;
    console.log('Received Comp ID:', compId); // Log received compId

    const comp = await Comp.findById(compId);
    if (!comp) return res.status(404).json({ message: 'Comp not found' });
    res.json(comp);
  } catch (err) {
    console.error('Error fetching comp by ID:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new comp
router.post('/', async (req, res) => {
  const { name, slots } = req.body;
  const comp = new Comp({ name, slots });
  try {
    const newComp = await comp.save();
    res.status(201).json(newComp);
  } catch (err) {
    console.error('Error creating new comp:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a comp
router.put('/:id', async (req, res) => {
  try {
    const compId = req.params.id;
    console.log('Received Comp ID for update:', compId); // Log received compId

    const comp = await Comp.findById(compId);
    if (!comp) return res.status(404).json({ message: 'Comp not found' });

    Object.assign(comp, req.body);
    await comp.save();
    res.json(comp);
  } catch (err) {
    console.error('Error updating comp:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a comp
router.delete('/:id', async (req, res) => {
  try {
    const compId = req.params.id;
    console.log('Received Comp ID for deletion:', compId); // Log received compId

    const comp = await Comp.findByIdAndDelete(compId);
    if (!comp) return res.status(404).json({ message: 'Comp not found' });

    res.json({ message: 'Comp deleted' });
  } catch (err) {
    console.error('Error deleting comp:', err.message, err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
