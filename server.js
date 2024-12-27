const express = require('express');
const app = express();
const rfg = require('./rfg-api').init();  // Initialize the RFG module

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to validate API key
function validateApiKey(req, res, next) {
  const providedKey = req.headers['x-api-key'];
  const apiKey = process.env.API_KEY;
  
  // Structured logging
  console.log(JSON.stringify({
    severity: 'DEBUG',
    message: 'API Key validation',
    providedKeyExists: !!providedKey,
    envKeyExists: !!apiKey,
    providedKeyLength: providedKey ? providedKey.length : 0,
    envKeyLength: apiKey ? apiKey.length : 0
  }));
  
  if (!providedKey || providedKey !== apiKey) {
    console.error(JSON.stringify({
      severity: 'ERROR',
      message: 'API Key validation failed',
      reason: !providedKey ? 'No key provided' : 'Key mismatch'
    }));
    
    res.status(401).json({ 
      error: 'Invalid API key',
      provided: providedKey ? 'Key provided' : 'No key provided',
      expected: apiKey ? 'Key exists in env' : 'No key in env'
    });
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
      console.error(JSON.stringify({
        severity: 'ERROR',
        message: 'Favicon generation failed',
        error: error.toString()
      }));
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
  console.log(JSON.stringify({
    severity: 'INFO',
    message: 'Server started',
    port: port,
    apiKeyPresent: !!process.env.API_KEY
  }));
}); 