import mongoose from 'mongoose';

const savedDiscoverySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planetSlug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Enforce unique planet save per user
savedDiscoverySchema.index({ userId: 1, planetSlug: 1 }, { unique: true });

const SavedDiscovery = mongoose.model('SavedDiscovery', savedDiscoverySchema);
export default SavedDiscovery;
