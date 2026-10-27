import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Planet from '../models/Planet.js';
import { planetsData } from '../data/planetsSeed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedPlanets = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/orbit_db';
  console.log(`[Seed] Connecting to MongoDB at ${uri}...`);

  try {
    await mongoose.connect(uri);
    console.log('[Seed] Connected to database successfully.');

    let inserted = 0;
    let updated = 0;

    for (const planet of planetsData) {
      const existing = await Planet.findOne({ slug: planet.slug });
      if (existing) {
        await Planet.findOneAndUpdate({ slug: planet.slug }, planet, { new: true });
        updated++;
      } else {
        await Planet.create(planet);
        inserted++;
      }
    }

    console.log(`[Seed] Planet catalog synchronization complete: ${inserted} inserted, ${updated} updated. Total planets: ${planetsData.length}.`);
    const count = await Planet.countDocuments();
    console.log(`[Seed] Total planets in database: ${count}`);

    await mongoose.disconnect();
    console.log('[Seed] Disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error(`[Seed] Error running seed script:`, err);
    process.exit(1);
  }
};

seedPlanets();
