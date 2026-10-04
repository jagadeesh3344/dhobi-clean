import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Redirect middleware to enforce clean URLs
app.use((req, res, next) => {
  // Ignore query parameters and check if path ends with .html
  const lowerPath = req.path.toLowerCase();
  if (lowerPath.endsWith('.html')) {
    const cleanPath = req.path.slice(0, -5);
    // If it's /index, redirect to root /
    if (cleanPath === '/index' || cleanPath === 'index') {
      const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      return res.redirect(301, '/' + query);
    } else {
      const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      return res.redirect(301, cleanPath + query);
    }
  }
  next();
});

// Serve static assets and files with .html extension support
app.use(express.static(__dirname, {
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    // Images and fonts can be cached
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png') || 
        filePath.endsWith('.webp') || filePath.endsWith('.svg') || filePath.endsWith('.gif') || 
        filePath.endsWith('.woff2')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else {
      // CSS, JS, HTML must not be cached during development
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Route for handling fallbacks if any (e.g. root to index.html is handled by express.static, but can fallback to index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
