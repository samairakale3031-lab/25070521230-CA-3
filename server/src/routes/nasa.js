import express from 'express';
import NodeCache from 'node-cache';

const router = express.Router();
// Cache search queries for 1 hour to prevent unnecessary repetitive external API calls
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// GET /api/nasa/search?q=...
router.get('/search', async (req, res) => {
  try {
    const rawQuery = req.query.q;

    if (!rawQuery || typeof rawQuery !== 'string' || !rawQuery.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required.',
      });
    }

    const query = rawQuery.trim().slice(0, 80);
    const cacheKey = `nasa_${query.toLowerCase()}`;

    // Return cached results if available
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        query,
        count: cachedData.length,
        items: cachedData,
      });
    }

    // Call official NASA Images and Video Library API with timeout
    const targetUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(
      query
    )}&media_type=image&page=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8500);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `NASA API responded with status ${response.status}`,
      });
    }

    const data = await response.json();
    const rawItems = data?.collection?.items || [];

    // Parse and extract up to 12 clean records with verified thumbnails
    const parsedItems = rawItems
      .slice(0, 16)
      .map((item) => {
        const meta = item.data?.[0] || {};
        const previewLink = item.links?.find((l) => l.rel === 'preview' || l.render === 'image');
        const thumbnailUrl = previewLink?.href || null;

        if (!thumbnailUrl || !meta.title) return null;

        return {
          id: meta.nasa_id || Math.random().toString(36).substring(7),
          nasaId: meta.nasa_id || '',
          title: meta.title,
          description: meta.description ? meta.description.slice(0, 300) : 'No description provided.',
          dateCreated: meta.date_created ? meta.date_created.split('T')[0] : 'Unknown date',
          center: meta.center || 'NASA',
          photographer: meta.photographer || null,
          keywords: Array.isArray(meta.keywords) ? meta.keywords.slice(0, 4) : [],
          thumbnailUrl,
          nasaAssetUrl: `https://images.nasa.gov/details/${meta.nasa_id}`,
        };
      })
      .filter(Boolean)
      .slice(0, 12);

    // Save in cache
    cache.set(cacheKey, parsedItems);

    res.status(200).json({
      success: true,
      source: 'live',
      query,
      count: parsedItems.length,
      items: parsedItems,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({
        success: false,
        message: 'NASA Image API request timed out. Please try again.',
      });
    }
    console.error('[NASA API Proxy Error]:', error);
    res.status(502).json({
      success: false,
      message: 'Failed to retrieve imagery from NASA Images API. Please check your network connection.',
    });
  }
});

export default router;
