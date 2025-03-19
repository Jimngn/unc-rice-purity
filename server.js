// Simple Express server to serve the UNC Purity Test application
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the index.html file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`UNC Purity Test server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
}); 