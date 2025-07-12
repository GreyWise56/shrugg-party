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

// --- Static Frontend Serving ---
const buildPath = path.join(__dirname, 'public');
app.use(express.static(buildPath));
console.log(`✅ [INIT] Static path set to: ${buildPath}`);

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
// ...

// --- API Endpoint ---
app.use('/api/shrugg', shruggLimiter);
app.post('/api/shrugg', async (req, res) => {
  // ... your existing API code
});

// --- Health Check Route ---
// A simple route to confirm the server is responsive.
app.get('/health', (req, res) => {
  console.log(`[${new Date().toISOString()}] ✅ Health check hit successfully!`);
  res.status(200).send('OK');
});

// --- Catch-all Route for React Frontend ---
// This MUST be the last route.
app.get('/*', (req, res) => {
  console.log(`[${new Date().toISOString()}] ➡️  Catch-all route hit for path: ${req.path}`);
  const indexHtmlPath = path.join(__dirname, 'public', 'index.html');
  console.log(`Attempting to serve index.html from: ${indexHtmlPath}`);
  
  // No need for fs.existsSync, res.sendFile handles errors.
  res.sendFile(indexHtmlPath, (err) => {
    if (err) {
      console.error(`❌ [ERROR] Failed to send file:`, err);
      res.status(500).send('Error serving the application.');
    } else {
      console.log(`[${new Date().toISOString()}] ✅ Successfully sent index.html`);
    }
  });
});

// --- Server Startup ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ShruggBot online at http://0.0.0.0:${PORT}`);
  console.log('✅ [READY] Server is now listening and ready for health checks.');
});