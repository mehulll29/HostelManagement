const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedInitialData = require('./seed');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/mess', require('./routes/messRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hostel Management MERN Backend is running cleanly' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Connect Database, Seed Data & Start Server
connectDB().then(async () => {
  await seedInitialData();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 MERN Backend Server active on http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
});
