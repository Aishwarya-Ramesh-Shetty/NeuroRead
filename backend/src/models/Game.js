import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    gameName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    gameType: {
      type: String,
      required: true,
      enum: [
        'picture_mcq',
        'match_column',
        'pronunciation_selection',
        'jumbled_letters',
        'letter_pronunciation'
      ]
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

gameSchema.index({ gameType: 1 });

const Game = mongoose.model('Game', gameSchema);

export default Game;
