const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');
const compRoutes = require('./routes/compRoutes');
const signupRoutes = require('./routes/signupRoutes'); // Add this line
const initializeDefaultComps = require('./config/initializeComps');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comps', compRoutes);
app.use('/api/signups', signupRoutes); // Add this line

// Initialize default comps
initializeDefaultComps();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
