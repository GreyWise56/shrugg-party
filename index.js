const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ ShruggBot barebones backend is responding!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🟢 ShruggBot test server running on http://0.0.0.0:${PORT}`);
});