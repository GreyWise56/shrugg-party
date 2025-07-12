const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// ... other require statements
const path = require('path');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// --- Static Frontend Serving ---
// This serves your pre-built React files from the 'public' folder.
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// --- (Your API code and other middleware goes here) ---
// ...

// --- Health Check Route ---
// This must come BEFORE the final catch-all route.
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// --- Catch-all Route for React Frontend ---
// This MUST be the last route. It handles React Router navigation.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Server Startup ---
// This MUST be at the very end.
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ShruggBot online at http://0.0.0.0:${PORT}`);
});