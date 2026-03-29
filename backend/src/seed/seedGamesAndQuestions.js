import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Game from '../models/Game.js';
import Pronunciation from '../models/Pronunciation.js';
import Question from '../models/Question.js';

const GAME_DEFINITIONS = [
  {
    gameName: 'Letter Recognition',
    gameType: 'letter_recognition',
    type: 'letter_recognition',
    difficulty: 'beginner',
    level: 1,
    order: 1,
    description: 'Identify the requested letter quickly.',
    questions: [
      {
        questionType: 'letter_select',
        questionText: 'Select the letter A.',
        options: ['A', 'B', 'D', 'E'],
        correctAnswer: 'A'
      }
    ]
  },
  {
    gameName: 'Alphabet Matching',
    gameType: 'alphabet_matching',
    type: 'alphabet_matching',
    difficulty: 'beginner',
    level: 1,
    order: 2,
    description: 'Match letters to their lowercase forms.',
    questions: [
      {
        questionType: 'match_pairs',
        questionText: 'Match uppercase with lowercase letters.',
        options: [
          { left: 'A', right: 'a' },
          { left: 'B', right: 'b' }
        ],
        correctAnswer: ['A-a', 'B-b']
      }
    ]
  },
  {
    gameName: 'Sound Identification',
    gameType: 'sound_identification',
    type: 'sound_identification',
    difficulty: 'beginner',
    level: 1,
    order: 3,
    description: 'Pick the letter that matches the played sound.',
    questions: [
      {
        questionType: 'audio_choice',
        questionText: 'Which letter makes this sound?',
        audioUrl: 'https://example.com/audio/letters/b.mp3',
        options: ['B', 'P', 'D'],
        correctAnswer: 'B'
      }
    ]
  },
  {
    gameName: 'Picture Based MCQ',
    gameType: 'picture_mcq',
    type: 'picture_mcq',
    difficulty: 'intermediate',
    level: 2,
    order: 1,
    description: 'A picture is shown and the student picks the correct word from multiple options.',
    questions: [
      {
        questionType: 'picture_mcq',
        questionText: 'Choose the correct word for the picture shown.',
        imageUrl: 'https://example.com/images/elephant.png',
        options: ['elephant', 'tiger', 'lion', 'zebra'],
        correctAnswer: 'elephant',
        audioUrl: 'https://example.com/audio/words/elephant.mp3'
      }
    ]
  },
  {
    gameName: 'Word Builder',
    gameType: 'jumbled_letters',
    type: 'word_builder',
    difficulty: 'intermediate',
    level: 2,
    order: 2,
    description: 'Students arrange scrambled letters to form a meaningful word.',
    questions: [
      {
        questionType: 'word_builder',
        questionText: 'Arrange letters to form the word for a flying bird: B, I, R, D',
        imageUrl: 'https://example.com/images/bird.png',
        options: ['B', 'I', 'R', 'D'],
        correctAnswer: 'BIRD',
        audioUrl: 'https://example.com/audio/words/bird.mp3'
      }
    ]
  },
  {
    gameName: 'Match the Column',
    gameType: 'match_column',
    type: 'match_column',
    difficulty: 'intermediate',
    level: 2,
    order: 3,
    description: 'Students match image cards with their correct words.',
    questions: [
      {
        questionType: 'match_column',
        questionText: 'Match each image with the right word.',
        imageUrl: 'https://example.com/images/match-set-1.png',
        options: ['apple', 'ball', 'cat', 'dog'],
        correctAnswer: 'apple'
      }
    ]
  },
  {
    gameName: 'Sentence Formation',
    gameType: 'sentence_formation',
    type: 'sentence_formation',
    difficulty: 'advanced',
    level: 3,
    order: 1,
    description: 'Arrange given words to form a complete sentence.',
    questions: [
      {
        questionType: 'sentence_reorder',
        questionText: 'Rearrange words to form a correct sentence.',
        options: ['I', 'school', 'go', 'to'],
        correctAnswer: 'I go to school'
      }
    ]
  },
  {
    gameName: 'Fill in the Blanks',
    gameType: 'fill_in_the_blanks',
    type: 'fill_in_the_blanks',
    difficulty: 'advanced',
    level: 3,
    order: 2,
    description: 'Complete the sentence with the correct word.',
    questions: [
      {
        questionType: 'fill_blank',
        questionText: 'The sun ____ in the east.',
        options: ['rise', 'rises', 'rising'],
        correctAnswer: 'rises',
        acceptedAnswers: ['rises']
      }
    ]
  },
  {
    gameName: 'Spelling Correction',
    gameType: 'spelling_correction',
    type: 'spelling_correction',
    difficulty: 'advanced',
    level: 3,
    order: 3,
    description: 'Find and correct misspelled words.',
    questions: [
      {
        questionType: 'spelling_correction',
        questionText: 'Correct this word: BANANNA',
        options: [],
        correctAnswer: 'BANANA',
        acceptedAnswers: ['banana', 'BANANA']
      }
    ]
  }
];

const LETTER_PRONUNCIATIONS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => ({
  letter,
  audioUrl: `https://example.com/audio/letters/${letter.toLowerCase()}.mp3`
}));

const seed = async () => {
  try {
    await connectDB();

    for (const definition of GAME_DEFINITIONS) {
      const { questions, ...gamePayload } = definition;

      const game = await Game.findOneAndUpdate(
        { level: gamePayload.level, order: gamePayload.order },
        gamePayload,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      await Question.deleteMany({ gameId: game._id });

      const questionDocs = questions.map((question) => ({
        ...question,
        gameId: game._id
      }));

      await Question.insertMany(questionDocs);
    }

    for (const pronunciation of LETTER_PRONUNCIATIONS) {
      await Pronunciation.findOneAndUpdate(
        { letter: pronunciation.letter },
        pronunciation,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log('Seed completed: games, questions, and pronunciations are ready.');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
