import mongoose from 'mongoose';

const pronunciationSchema = new mongoose.Schema(
  {
    letter: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: 1,
      maxlength: 1,
      match: /^[A-Z]$/
    },
    audioUrl: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

pronunciationSchema.index({ letter: 1 }, { unique: true });

const Pronunciation = mongoose.model('Pronunciation', pronunciationSchema);

export default Pronunciation;
