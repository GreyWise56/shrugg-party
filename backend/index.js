const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');
const axios = require('axios');
const cheerio = require('cheerio');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// --- Static Frontend Serving ---
// This MUST come before your API routes and catch-all route.
// It serves all the static files like CSS, JS, and images from your React build folder.
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// --- API Rate Limiting ---
const shruggLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

// --- OpenAI Configuration ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// --- (All your helper functions and prompt logic would be here) ---
// ...

// --- API Endpoint ---
app.use('/api/shrugg', shruggLimiter);
app.post('/api/shrugg', async (req, res) => {
  // ... your existing API code
});


// --- Catch-all Route for React Frontend ---
// This MUST be the last route.
// It serves the main index.html file to any request that isn't for a static file or your API.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Server Startup ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ShruggBot online at http://0.0.0.0:${PORT}`);
});