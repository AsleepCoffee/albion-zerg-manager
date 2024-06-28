const express = require('express');
const cors = require('cors'); 
const path = require('path');
const connectDB = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');
const compRoutes = require('./routes/compRoutes');
const signupRoutes = require('./routes/signupRoutes');
const initializeDefaultComps = require('./config/initializeComps');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for all routes

// Serve static images
const imagesPath = path.join(__dirname, 'images');
console.log(`Serving images from: ${imagesPath}`); // Log to verify correct path
app.use('/images', express.static(imagesPath));

// Log static file requests for debugging
app.get('/images/*', (req, res, next) => {
  console.log(`Static file request: ${req.path}`);
  next();
});

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comps', compRoutes);
app.use('/api/signups', signupRoutes);

// Initialize default comps
initializeDefaultComps();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
