const express = require('express');
const app = express();
const rfg = require('./rfg-api').init();  // Initialize the RFG module

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to validate API key
function validateApiKey(req, res, next) {
  const providedKey = req.headers['x-api-key'];
  const apiKey = process.env.API_KEY;
  
  if (!providedKey || providedKey !== apiKey) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }
  
  next();
}

// Main endpoint for favicon generation
app.post('/generate', validateApiKey, (req, res) => {
  const request = req.body.favicon_generation;
  
  // Create a temporary directory for files
  const tempDir = '/tmp/favicons';
  
  rfg.generateFavicon(request, tempDir, (error, result) => {
    if (error) {
      console.error('Error generating favicon:', error);
      res.status(500).json({ error: error.toString() });
      return;
    }
    
    res.json({ result });
  });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
