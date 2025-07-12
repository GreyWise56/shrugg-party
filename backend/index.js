const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');
const axios = require('axios');
const cheerio = require('cheerio');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

console.log('✅ [INIT] Server script starting...');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

console.log('✅ [INIT] Express app initialized.');

// NOTE: We have REMOVED app.use(express.static) to be more explicit.

// --- API Rate Limiting ---
const shruggLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

// --- OpenAI Configuration ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// --- (All your helper functions and prompt logic would be here, unchanged) ---
// ... (imagine all your functions like isUrl, getTitleFromUrl, prompts, etc. are here)

// --- API Endpoint ---
app.use('/api/shrugg', shruggLimiter);
app.post('/api/shrugg', async (req, res) => {
  // ... your existing API code
});

// --- Health Check Route ---
app.get('/health', (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Health check hit successfully!`);
  res.status(200).send('OK');
});

// --- Catch-all Route for React Frontend ---
// This MUST be the last route. It will handle serving your React app.
app.get('/*', (req, res) => {
  console.log(`[${new Date().toISOString()}] ➡️  Catch-all route hit for path: ${req.path}`);
  const indexHtmlPath = path.join(__dirname, 'public', 'index.html');
  
  res.sendFile(indexHtmlPath, (err) => {
    if (err) {
      console.error(`❌ [ERROR] Failed to send index.html:`, err);
      res.status(500).send('Could not send the main application file.');
    } else {
      console.log(`[${new Date().toISOString()}] ✅ Successfully sent index.html`);
    }
  });
});

// --- Server Startup ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ShruggBot online at http://0.0.0.0:${PORT}`);
  console.log('✅ [READY] Server is now listening.');
});