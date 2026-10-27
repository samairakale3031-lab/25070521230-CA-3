import express from 'express';
import mongoose from 'mongoose';
import SavedDiscovery from '../models/SavedDiscovery.js';
import Planet from '../models/Planet.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/saved-discoveries - Retrieve all saved planets for current user
router.get('/', async (req, res) => {
  try {
    const saved = await SavedDiscovery.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Populate planet details for each saved discovery
    const planetSlugs = saved.map((s) => s.planetSlug);
    const planets = await Planet.find({ slug: { $in: planetSlugs } });
    const planetMap = new Map(planets.map((p) => [p.slug, p]));

    const enriched = saved.map((item) => ({
      _id: item._id,
      planetSlug: item.planetSlug,
      createdAt: item.createdAt,
      planet: planetMap.get(item.planetSlug) || null,
    }));

    res.status(200).json({
      success: true,
      count: enriched.length,
      savedDiscoveries: enriched,
    });
  } catch (error) {
    console.error('[Get Saved Discoveries Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve saved discoveries.' });
  }
});

// POST /api/saved-discoveries - Save a planet to user observatory
router.post('/', async (req, res) => {
  try {
    const { planetSlug } = req.body;

    if (!planetSlug || typeof planetSlug !== 'string') {
      return res.status(400).json({ success: false, message: 'planetSlug is required.' });
    }

    const normalizedSlug = planetSlug.trim().toLowerCase();

    // Verify planet exists in catalog
    const planet = await Planet.findOne({ slug: normalizedSlug });
    if (!planet) {
      return res.status(404).json({ success: false, message: `Planet '${normalizedSlug}' not found.` });
    }

    // Check if already saved
    const existing = await SavedDiscovery.findOne({
      userId: req.user._id,
      planetSlug: normalizedSlug,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `${planet.name} is already saved in your Observatory.`,
        savedDiscovery: existing,
      });
    }

    const saved = await SavedDiscovery.create({
      userId: req.user._id,
      planetSlug: normalizedSlug,
    });

    res.status(201).json({
      success: true,
      message: `${planet.name} has been added to your Observatory.`,
      savedDiscovery: {
        _id: saved._id,
        planetSlug: saved.planetSlug,
        createdAt: saved.createdAt,
        planet,
      },
    });
  } catch (error) {
    console.error('[Save Discovery Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to save planet discovery.' });
  }
});

// DELETE /api/saved-discoveries/:id - Remove saved discovery by ID or by planetSlug
router.delete('/:id', async (req, res) => {
  try {
    const param = req.params.id.trim();
    let query = { userId: req.user._id };

    if (mongoose.Types.ObjectId.isValid(param)) {
      query._id = param;
    } else {
      query.planetSlug = param.toLowerCase();
    }

    const deleted = await SavedDiscovery.findOneAndDelete(query);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Saved discovery not found or you are not authorized to remove it.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Planet removed from your Observatory.',
      deletedPlanetSlug: deleted.planetSlug,
    });
  } catch (error) {
    console.error('[Delete Saved Discovery Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to remove saved planet.' });
  }
});

export default router;
