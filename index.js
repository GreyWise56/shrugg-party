const express = require('express');
const app = express();

// Literally the most basic server possible
app.get('/', (req, res) => {
  res.send('Hello from ShruggBot! 🤷‍♂️');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});