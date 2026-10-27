import express from 'express';
import Planet from '../models/Planet.js';

const router = express.Router();

// GET /api/planets - Fetch all planets sorted by order from Sun
router.get('/', async (req, res) => {
  try {
    const planets = await Planet.find().sort({ orderFromSun: 1 });
    res.status(200).json({
      success: true,
      count: planets.length,
      planets,
    });
  } catch (error) {
    console.error('[Get Planets Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve planet catalog.' });
  }
});

// GET /api/planets/:slug - Fetch single planet by slug
router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const planet = await Planet.findOne({ slug });

    if (!planet) {
      return res.status(404).json({
        success: false,
        message: `Planet with identifier '${slug}' was not found in the catalog.`,
      });
    }

    // Determine previous and next planets for smooth navigation
    const allPlanets = await Planet.find({}, 'slug name orderFromSun').sort({ orderFromSun: 1 });
    const currentIndex = allPlanets.findIndex((p) => p.slug === slug);

    const prevPlanet = currentIndex > 0 ? allPlanets[currentIndex - 1] : allPlanets[allPlanets.length - 1];
    const nextPlanet = currentIndex < allPlanets.length - 1 ? allPlanets[currentIndex + 1] : allPlanets[0];

    res.status(200).json({
      success: true,
      planet,
      navigation: {
        previous: { slug: prevPlanet.slug, name: prevPlanet.name },
        next: { slug: nextPlanet.slug, name: nextPlanet.name },
      },
    });
  } catch (error) {
    console.error('[Get Planet Detail Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve planet details.' });
  }
});

export default router;
