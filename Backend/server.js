require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('LuxLib Backend API is running');
});

// Member routes
const memberRoutes = require('./routes/memberRoutes');
app.use('/api/members', memberRoutes);

// Book routes
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

// lending routes
const lendingRoutes = require('./routes/lendingRoutes');
app.use('/api/lending', lendingRoutes);

// Fine routes
const fineRoutes = require('./routes/fineRoutes');
app.use('/api/fines', fineRoutes);

// Report routes
const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
