import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Game from '../models/Game.js';
import Question from '../models/Question.js';

const GAME_DEFINITIONS = [
  {
    gameName: 'Picture Based MCQ',
    gameType: 'picture_mcq',
    description:
      'A picture is shown and the student picks the correct word from multiple options.',
    questions: [
      {
        questionText: 'Choose the correct word for the picture shown.',
        imageUrl: 'https://example.com/images/elephant.png',
        options: ['elephant', 'tiger', 'lion', 'zebra'],
        correctAnswer: 'elephant',
        audioUrl: 'https://example.com/audio/words/elephant.mp3'
      }
    ]
  },
  {
    gameName: 'Match the Column',
    gameType: 'match_column',
    description: 'Students match image cards with their correct words.',
    questions: [
      {
        questionText: 'Match each image with the right word.',
        imageUrl: 'https://example.com/images/match-set-1.png',
        options: ['apple', 'ball', 'cat', 'dog'],
        correctAnswer: 'apple',
        audioUrl: null
      }
    ]
  },
  {
    gameName: 'Correct Pronunciation Selection',
    gameType: 'pronunciation_selection',
    description: 'Students listen and choose the correctly pronounced word.',
    questions: [
      {
        questionText: 'Which audio pronounces "banana" correctly?',
        imageUrl: null,
        options: ['banana', 'banena', 'bannana', 'bonana'],
        correctAnswer: 'banana',
        audioUrl: 'https://example.com/audio/words/banana.mp3'
      }
    ]
  },
  {
    gameName: 'Drag and Arrange Jumbled Letters',
    gameType: 'jumbled_letters',
    description: 'Students arrange scrambled letters to form a meaningful word.',
    questions: [
      {
        questionText: 'Arrange letters to form the word for a flying bird: B, I, R, D',
        imageUrl: 'https://example.com/images/bird.png',
        options: ['B', 'I', 'R', 'D'],
        correctAnswer: 'BIRD',
        audioUrl: 'https://example.com/audio/words/bird.mp3'
      }
    ]
  },
  {
    gameName: 'Letter Pronunciation',
    gameType: 'letter_pronunciation',
    description: 'Students click letters and hear their pronunciation.',
    questions: [
      {
        questionText: 'Click letter E and listen to its pronunciation.',
        imageUrl: null,
        options: ['E', 'F'],
        correctAnswer: 'E',
        audioUrl: 'https://example.com/audio/letters/e.mp3'
      }
    ]
  }
];

const seed = async () => {
  try {
    await connectDB();

    for (const definition of GAME_DEFINITIONS) {
      const { questions, ...gamePayload } = definition;

      const game = await Game.findOneAndUpdate(
        { gameType: gamePayload.gameType },
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

    console.log('Seed completed: games and starter questions are ready.');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();