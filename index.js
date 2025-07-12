const express = require('express');
const app = express();

// Railway-specific middleware
app.use(express.json({ limit: '10mb' }));

// Add this - Railway sometimes needs explicit headers
app.use((req, res, next) => {
  res.header('X-Powered-By', 'ShruggBot');
  next();
});

// Health check FIRST
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head><title>ShruggBot</title></head>
      <body>
        <h1>ShruggBot is alive! 🤷‍♂️</h1>
        <p>Railway deployment successful</p>
        <a href="/health">Health Check</a>
      </body>
    </html>
  `);
});

// Your API route
app.post('/api/shrugg', (req, res) => {
  const { text } = req.body || {};
  res.json({
    reaction: `Shrugging at: ${text || 'nothing'}`,
    score: Math.floor(Math.random() * 10) + 1,
  });
});

// Catch unhandled routes
app.use('*', (req, res) => {
  res.status(404).send('Route not found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 3000;

// Railway-specific server startup
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💻 Platform: ${process.platform}`);
  console.log(`🔗 Listening on: http://0.0.0.0:${PORT}`);
});

// Handle Railway's shutdown signals
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});