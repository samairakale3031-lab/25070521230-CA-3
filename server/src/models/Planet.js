import mongoose from 'mongoose';

const planetSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    orderFromSun: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Terrestrial Planet', 'Gas Giant', 'Ice Giant'],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    diameterKm: {
      type: Number,
      required: true,
    },
    distanceFromSunKm: {
      type: Number,
      required: true,
    },
    orbitalPeriod: {
      type: String,
      required: true, // e.g. "88 Earth days", "365.25 days", "29.5 Earth years"
    },
    rotationPeriod: {
      type: String,
      required: true, // e.g. "58.6 Earth days", "24 hours", "-243 Earth days (retrograde)"
    },
    surfaceGravity: {
      type: String, // e.g. "3.7 m/s²", "9.8 m/s²", "24.79 m/s²"
    },
    temperatureRange: {
      type: String, // e.g. "-180°C to 430°C", "465°C constant"
    },
    moonCount: {
      type: Number,
      default: 0,
    },
    notableMoons: [
      {
        type: String,
      },
    ],
    facts: [
      {
        type: String,
      },
    ],
    atmosphere: [
      {
        type: String,
      },
    ],
    visualMetadata: {
      primaryColor: { type: String, default: '#6366f1' },
      secondaryColor: { type: String, default: '#818cf8' },
      glowColor: { type: String, default: 'rgba(99, 102, 241, 0.4)' },
      textureStyle: { type: String, default: 'smooth' }, // cratered, banded, clouds, rocky, stormy, rings
      ringSystem: { type: Boolean, default: false },
      ringColor: { type: String, default: 'rgba(216, 180, 140, 0.6)' },
      sizeRatio: { type: Number, default: 1 }, // visual relative scale factor
      accentTag: { type: String, default: 'Rocky World' },
    },
  },
  {
    timestamps: true,
  }
);

const Planet = mongoose.model('Planet', planetSchema);
export default Planet;
