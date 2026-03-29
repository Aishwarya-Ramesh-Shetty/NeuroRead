import mongoose from 'mongoose';

const GAME_TYPES = [
  'picture_mcq',
  'match_column',
  'pronunciation_selection',
  'jumbled_letters',
  'letter_pronunciation',
  'letter_recognition',
  'alphabet_matching',
  'sound_identification',
  'word_builder',
  'sentence_formation',
  'fill_in_the_blanks',
  'spelling_correction'
];

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
      enum: GAME_TYPES
    },
    type: {
      type: String,
      required: true,
      enum: GAME_TYPES
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    order: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
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

gameSchema.pre('validate', function populateAliases(next) {
  if (!this.type && this.gameType) {
    this.type = this.gameType;
  }

  if (!this.gameType && this.type) {
    this.gameType = this.type;
  }

  next();
});

gameSchema.index({ gameType: 1 });
gameSchema.index({ difficulty: 1, level: 1, order: 1 });
gameSchema.index({ level: 1, order: 1 }, { unique: true });

const Game = mongoose.model('Game', gameSchema);

export default Game;
