import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { parseGoogleMapsInput } from './src/utils/schoolUtils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  /**
   * Resolves shortened Google Maps links (e.g. https://maps.app.goo.gl/MKFZvMQ8UKvrshGMA)
   * by following the HTTP redirect header on the server and returning the parsed embed URL,
   * share URL, place label, and coordinates.
   */
  app.get('/api/resolve-map-link', async (req, res) => {
    const rawUrl = String(req.query.url || '').trim();
    if (!rawUrl) {
      res.status(400).json({ error: 'Missing url parameter' });
      return;
    }

    try {
      let currentUrl = rawUrl;

      // If it is a short URL, follow up to 3 hops manually to capture the real Google Maps Place URL
      if (/^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)\//i.test(currentUrl)) {
        for (let hop = 0; hop < 3; hop++) {
          const response = await fetch(currentUrl, {
            method: 'GET',
            redirect: 'manual',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
          });

          const locationHeader = response.headers.get('location');
          if (!locationHeader) {
            break;
          }

          const nextUrl = new URL(locationHeader, currentUrl).toString();

          // If Google redirects to /sorry/index?continue=..., unwrap the continue URL immediately
          if (nextUrl.includes('google.com/sorry') && nextUrl.includes('continue=')) {
            try {
              const sorryObj = new URL(nextUrl);
              const cont = sorryObj.searchParams.get('continue');
              if (cont) {
                currentUrl = decodeURIComponent(cont);
              }
            } catch {
              // keep currentUrl
            }
            break;
          }

          currentUrl = nextUrl;

          // Once we have the /maps/place/ or @lat,lng URL, we have everything we need
          if (currentUrl.includes('/maps/place/') || /@-?\d+\.\d+,-?\d+\.\d+/.test(currentUrl)) {
            break;
          }
        }
      }

      const parsed = parseGoogleMapsInput(currentUrl);
      res.json({
        originalUrl: rawUrl,
        expandedUrl: currentUrl,
        embedUrl: parsed.embedUrl,
        shareUrl: rawUrl.startsWith('http') ? rawUrl : parsed.shareUrl,
        label: parsed.label,
        coordinates: parsed.coordinates || null
      });
    } catch {
      const fallback = parseGoogleMapsInput(rawUrl);
      res.json({
        originalUrl: rawUrl,
        expandedUrl: rawUrl,
        embedUrl: fallback.embedUrl,
        shareUrl: fallback.shareUrl,
        label: fallback.label,
        coordinates: fallback.coordinates || null
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SRT School server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
