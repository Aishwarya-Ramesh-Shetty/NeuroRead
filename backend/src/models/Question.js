import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
      index: true
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    imageUrl: {
      type: String,
      default: null,
      trim: true
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 2,
        message: 'At least two options are required'
      }
    },
    correctAnswer: {
      type: String,
      required: true,
      trim: true
    },
    audioUrl: {
      type: String,
      default: null,
      trim: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

questionSchema.index({ gameId: 1, createdAt: -1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;
