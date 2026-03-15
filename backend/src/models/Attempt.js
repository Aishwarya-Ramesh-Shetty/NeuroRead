import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
      index: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    timeTaken: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

attemptSchema.index({ userId: 1, gameId: 1, createdAt: -1 });

const Attempt = mongoose.model('Attempt', attemptSchema);

export default Attempt;
