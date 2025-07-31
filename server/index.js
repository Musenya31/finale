import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in the .env file.");
  process.exit(1); // Exit the app if Mongo URI is not set
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // or use express.json() instead
// app.use(express.json()); // If preferred

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import shiftRoutes from './routes/shifts.js';
import notesRoutes from './routes/notes.js';
import handoverRoutes from './routes/handovers.js';
import patientsRoutes from './routes/patients.js'; // If you have a patients route

// Add other routes like patients.js here if needed

// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/handovers', handoverRoutes);
app.use('/api/patients', patientsRoutes); // If you have a patients route


// Root route
app.get('/', (req, res) => {
  res.send('🩺 Nurse Shift App API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
