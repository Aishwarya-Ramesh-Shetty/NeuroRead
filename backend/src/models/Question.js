import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
      index: true
    },
    questionType: {
      type: String,
      trim: true,
      default: 'standard'
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
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    acceptedAnswers: {
      type: [String],
      default: []
    },
    audioUrl: {
      type: String,
      default: null,
      trim: true
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

questionSchema.index({ gameId: 1, createdAt: -1 });
questionSchema.index({ gameId: 1, questionType: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;
