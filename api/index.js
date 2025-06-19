import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Since TypeScript files need compilation, let's create a simple API first

// Create Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eventhub")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));
}

// Simple routes for testing
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "EventHub API is running on Vercel!",
    timestamp: new Date().toISOString()
  });
});

// Mock events endpoint for testing
app.get("/api/events", (req, res) => {
  res.status(200).json({ 
    events: [],
    message: "Events endpoint working! Backend connected successfully."
  });
});

// Mock auth endpoints
app.post("/api/auth/login", (req, res) => {
  res.status(200).json({ 
    message: "Login endpoint working! Please set up full authentication." 
  });
});

app.post("/api/auth/register", (req, res) => {
  res.status(200).json({ 
    message: "Register endpoint working! Please set up full authentication." 
  });
});

export default app; 