const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Init app
const app = express();
app.use(express.json());
app.use(cors());

console.log("👣 Starting ShruggBot server...");

// Rate limit for API
const shruggLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});
app.use('/api/shrugg', shruggLimiter);

// Health check route (move this early)
app.get('/health', (_, res) => res.status(200).send('OK'));

// Dummy API handler
app.post('/api/shrugg', async (req, res) => {
  try {
    const { text } = req.body;
    res.json({
      reaction: `Shrugging at: ${text}`,
      score: Math.floor(Math.random() * 10) + 1,
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// React static files
const reactBuildPath = path.join(__dirname, 'shruggbot-ui', 'build');
console.log("📂 React build path:", reactBuildPath);
console.log("📁 React build exists?", fs.existsSync(reactBuildPath));
console.log("🔍 Current working directory:", process.cwd());
console.log("🗂 __dirname:", __dirname);

// Debug route to check for index.html
app.get('/debug-index', (_, res) => {
  const indexPath = path.join(reactBuildPath, 'index.html');
  const exists = fs.existsSync(indexPath);
  const contents = fs.existsSync(reactBuildPath) ? fs.readdirSync(reactBuildPath) : [];
  res.json({
    indexExists: exists,
    buildPathExists: fs.existsSync(reactBuildPath),
    buildContents: contents,
    fullPath: indexPath
  });
});

// Serve static files if build exists
if (fs.existsSync(reactBuildPath)) {
  console.log("✅ Serving static files from:", reactBuildPath);
  app.use(express.static(reactBuildPath));
} else {
  console.log("❌ Build directory not found, serving fallback only");
}

// Fallback route for root
app.get('/', (req, res) => {
  const indexFile = path.join(reactBuildPath, 'index.html');
  if (fs.existsSync(indexFile)) {
    console.log("✅ Serving React app for root route...");
    res.sendFile(indexFile);
  } else {
    console.log("🔄 React build not found, serving fallback");
    res.send(`
      <html>
        <head><title>ShruggBot</title></head>
        <body>
          <h1>ShruggBot Backend is Running! 🤷‍♂️</h1>
          <p>Frontend build not found. Check the build process.</p>
          <p><a href="/debug-index">Debug Build Info</a></p>
          <p><a href="/health">Health Check</a></p>
        </body>
      </html>
    `);
  }
});

// Catch-all: serve React frontend for client-side routing
app.get('*', (req, res) => {
  const indexFile = path.join(reactBuildPath, 'index.html');
  if (fs.existsSync(indexFile)) {
    console.log("✅ Serving React app for route:", req.path);
    res.sendFile(indexFile);
  } else {
    console.error("❌ index.html not found for route:", req.path);
    res.status(404).send(`
      <html>
        <head><title>ShruggBot - Not Found</title></head>
        <body>
          <h1>Page Not Found</h1>
          <p>The React build is missing. <a href="/">Go Home</a></p>
        </body>
      </html>
    `);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ShruggBot online at http://0.0.0.0:${PORT}`);
  console.log(`🔍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});