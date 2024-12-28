import express from 'express';
import { generateFavicon } from './favicon-generator.js';
import { mkdir } from 'fs/promises';

const app = express();
app.use(express.json());

// Middleware to validate API key
function validateApiKey(req, res, next) {
  const providedKey = req.headers['x-api-key'];
  const apiKey = process.env.API_KEY;
  
  if (!providedKey || providedKey !== apiKey) {
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
app.post('/generate', validateApiKey, async (req, res) => {
  try {
    const { master_picture } = req.body.favicon_generation;
    
    if (!master_picture || !master_picture.url) {
      res.status(400).json({ error: 'Missing master picture URL' });
      return;
    }

    // Create output directory
    const outputDir = '/tmp/favicons';
    await mkdir(outputDir, { recursive: true });
    
    // Generate favicons
    const result = await generateFavicon(master_picture.url, outputDir);
    
    res.json({ result });
  } catch (error) {
    console.error('Error generating favicon:', error);
    res.status(500).json({ error: error.toString() });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(JSON.stringify({
    severity: 'INFO',
    message: 'Server started',
    port: port,
    apiKeyPresent: !!process.env.API_KEY
  }));
}); 