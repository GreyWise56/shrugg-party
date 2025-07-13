const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');
const axios = require('axios');
const cheerio = require('cheerio');
const rateLimit = require('express-rate-limit');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// --- Static Frontend Serving ---
// This serves your pre-built React files from the 'public' folder.
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// --- API Rate Limiting ---
const shruggLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    reaction: "You’re Shruggin' too hard. Even Nutwhisker needs a break.",
    score: 10
  }
});

// --- OpenAI Configuration ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// --- Helper Functions & Prompt Logic ---
// ... (All your functions like isUrl, getTitleFromUrl, prompts, etc., go here)


// --- API Endpoint ---
app.use('/api/shrugg', shruggLimiter);
app.post('/api/shrugg', async (req, res) => {
    // Your full API logic here...
    // This is just a placeholder to keep the file structure correct.
    res.json({ reaction: "API is working.", score: 5 });
});


// --- Catch-all Route for React Frontend ---
// This MUST be the last route. It handles React Router navigation.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// --- Server Startup & Graceful Shutdown ---
const PORT = process.env.PORT || 3000;

// ✅ FIX: Capture the server instance when you start it
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ShruggBot online at http://0.0.0.0:${PORT}`);
});

// This function will be called when you press Ctrl+C
const gracefulShutdown = () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

// Listen for the termination signal
process.on('SIGINT', gracefulShutdown);