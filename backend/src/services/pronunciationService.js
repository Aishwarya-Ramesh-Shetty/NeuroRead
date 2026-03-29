import Pronunciation from '../models/Pronunciation.js';
import AppError from '../utils/appError.js';

export const getPronunciationByLetter = async (letter) => {
  const normalizedLetter = String(letter || '').trim().toUpperCase();

  if (!/^[A-Z]$/.test(normalizedLetter)) {
    throw new AppError('letter must be a single alphabet character from A-Z', 400);
  }

  const pronunciation = await Pronunciation.findOne({ letter: normalizedLetter }).lean();

  if (!pronunciation) {
    throw new AppError('Pronunciation not found for this letter', 404);
  }

  return pronunciation;
};
