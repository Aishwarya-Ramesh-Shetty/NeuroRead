import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema(
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
    isCompleted: {
      type: Boolean,
      default: false,
      index: true
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

userProgressSchema.index({ userId: 1, gameId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, unlockedAt: 1 });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;
