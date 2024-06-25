const Comp = require('../models/Comp');
const Event = require('../models/Event');

// Define the default comps
const defaultComps = [
  {
    name: 'Default Comp',
    slots: [
      'Earthrune or 1H Mace',
      'H. Mace',
      'Bedrock w/ Mistcaller',
      '1H.Hammer w/ Leering',
      'Chariot',
      'Oathkeepers',
      'Locus',
      'Rootbound',
      'Lifecurse w/ Aegis',
      'Hallowfall w/ Mistcaller',
      'Hallowfall w/ Mistcaller',
      'Hallowfall w/ Mistcaller',
      'Blight',
      'Damnation',
      'Realmbreaker',
      'Spirithunter',
      'Spiked Guant',
      'Infernal Scythe',
      'Infernal Scythe',
      'Perma',
    ],
  },
];

// Function to initialize default comps
const initializeDefaultComps = async () => {
  try {
    const existingComps = await Comp.find({});
    if (existingComps.length === 0) {
      await Comp.insertMany(defaultComps);
      console.log('Default comps initialized');
    }
  } catch (error) {
    console.error('Error initializing default comps:', error);
  }
};

// Get all comps
exports.getComps = async (req, res) => {
  try {
    const comps = await Comp.find({});
    res.json(comps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comps' });
  }
};

// Add a new comp
exports.addComp = async (req, res) => {
  try {
    const newComp = new Comp(req.body);
    await newComp.save();
    res.status(201).json(newComp);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comp' });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event' });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { time, comp, caller, hammers, sets, rewards, parties, eventType } = req.body;
    const selectedComp = await Comp.findOne({ name: comp });
    const compSlots = selectedComp ? selectedComp.slots : [];
    const newEvent = new Event({ time, comp, caller, hammers, sets, rewards, parties, eventType, compSlots });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const { time, comp, caller, hammers, sets, rewards, parties, eventType } = req.body;
    const selectedComp = await Comp.findOne({ name: comp });
    const compSlots = selectedComp ? selectedComp.slots : [];
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { time, comp, caller, hammers, sets, rewards, parties, eventType, compSlots },
      { new: true }
    );
    if (updatedEvent) {
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating event' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (deletedEvent) {
      res.json({ message: 'Event deleted successfully' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event' });
  }
};

// Get sign-ups for an event
exports.getSignUps = (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  if (signups[eventId]) {
    res.json(signups[eventId]);
  } else {
    res.status(404).json({ message: 'No signups found for this event' });
  }
};

// Create a new sign-up
exports.createSignUp = (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const { name, firstPick, secondPick, thirdPick } = req.body;

  if (!signups[eventId]) {
    signups[eventId] = [];
  }

  const newSignUp = { id: signups[eventId].length + 1, name, firstPick, secondPick, thirdPick };
  signups[eventId].push(newSignUp);
  res.status(201).json(newSignUp);
};

// Assign roles for an event
exports.assignRoles = async (req, res) => {
  try {
    const { assignedRoles } = req.body;
    const event = await Event.findById(req.params.id);
    if (event) {
      event.assignedRoles = assignedRoles;
      await event.save();
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error assigning roles' });
  }
};

// Initialize default comps when the server starts
initializeDefaultComps();
