
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Game from '../models/Game.js';
import Pronunciation from '../models/Pronunciation.js';
import Question from '../models/Question.js';

const BASE_URL = 'http://localhost:5000/public';

const GAME_DEFINITIONS = [

  
  {
    gameName: 'Letter Recognition',
    gameType: 'letter_recognition',
    level: 1,
    order: 1,
    questions: [
      { questionText: 'Select letter A', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
      { questionText: 'Select letter B', options: ['A', 'B', 'D', 'E'], correctAnswer: 'B' },
      { questionText: 'Select letter C', options: ['C', 'A', 'F', 'G'], correctAnswer: 'C' },
      { questionText: 'Select letter D', options: ['A', 'D', 'H', 'I'], correctAnswer: 'D' },
      { questionText: 'Select letter E', options: ['E', 'F', 'G', 'H'], correctAnswer: 'E' }
    ]
  },

  // ✅ ALPHABET MATCHING
  {
    gameName: 'Alphabet Matching',
    gameType: 'alphabet_matching',
    level: 1,
    order: 2,
    questions: [
      { questionText: 'Match A-a', options: [{ left: 'A', right: 'a' }], correctAnswer: ['A-a'] },
      { questionText: 'Match B-b', options: [{ left: 'B', right: 'b' }], correctAnswer: ['B-b'] },
      { questionText: 'Match C-c', options: [{ left: 'C', right: 'c' }], correctAnswer: ['C-c'] },
      { questionText: 'Match D-d', options: [{ left: 'D', right: 'd' }], correctAnswer: ['D-d'] },
      { questionText: 'Match E-e', options: [{ left: 'E', right: 'e' }], correctAnswer: ['E-e'] }
    ]
  },

  // ✅ SOUND IDENTIFICATION
  {
    gameName: 'Sound Identification',
    gameType: 'sound_identification',
    level: 1,
    order: 3,
    questions: [
      { questionText: 'Which letter sound?', audioUrl: `${BASE_URL}/audio/a.mp3`, options: ['A', 'B', 'C'], correctAnswer: 'A' },
      { questionText: 'Which letter sound?', audioUrl: `${BASE_URL}/audio/b.mp3`, options: ['B', 'D', 'E'], correctAnswer: 'B' },
      { questionText: 'Which letter sound?', audioUrl: `${BASE_URL}/audio/c.mp3`, options: ['C', 'F', 'G'], correctAnswer: 'C' },
      { questionText: 'Which letter sound?', audioUrl: `${BASE_URL}/audio/d.mp3`, options: ['D', 'H', 'I'], correctAnswer: 'D' },
      { questionText: 'Which letter sound?', audioUrl: `${BASE_URL}/audio/e.mp3`, options: ['E', 'J', 'K'], correctAnswer: 'E' }
    ]
  },

  // ✅ PICTURE MCQ
  {
    gameName: 'Picture MCQ',
    gameType: 'picture_mcq',
    level: 2,
    order: 1,
    questions: [
      {
        questionText: 'Identify the animal',
        imageUrl: 'https://images.pexels.com/photos/133394/pexels-photo-133394.jpeg?cs=srgb&dl=pexels-inspiredimages-133394.jpg&fm=jpg',
        options: ['elephant', 'lion', 'tiger', 'dog'],
        correctAnswer: 'elephant',
        audioUrl: `${BASE_URL}/audio/elephant.mp3`
      },
      {
        questionText: 'Identify the bird',
        imageUrl: 'https://cdn.pixabay.com/photo/2025/05/04/18/04/robin-9578746_1280.jpg',
        options: ['bird', 'cat', 'fish', 'cow'],
        correctAnswer: 'bird',
        audioUrl: `${BASE_URL}/audio/bird.mp3`
      },
      {
        questionText: 'Identify the fruit',
        imageUrl: 'https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/articles/health_tools/healing_foods_slideshow/1800ss_getty_rf_apples.jpg?resize=750px:*&output-quality=75',
        options: ['apple', 'banana', 'mango', 'orange'],
        correctAnswer: 'apple',
        audioUrl: `${BASE_URL}/audio/apple.mp3`
      },
      {
        questionText: 'Identify the animal',
        imageUrl: 'https://img.freepik.com/free-photo/little-cat-sitting-grass_1150-17019.jpg?semt=ais_incoming&w=740&q=80',
        options: ['cat', 'dog', 'lion', 'tiger'],
        correctAnswer: 'cat',
        audioUrl: `${BASE_URL}/audio/cat.mp3`
      },
      {
        questionText: 'Identify the animal',
        imageUrl: 'https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_1280.jpg',
        options: ['dog', 'wolf', 'fox', 'lion'],
        correctAnswer: 'dog',
        audioUrl: `${BASE_URL}/audio/dog.mp3`
      }
    ]
  },

  // ✅ WORD BUILDER
  {
    gameName: 'Word Builder',
    gameType: 'word_builder',
    level: 2,
    order: 2,
    questions: [
      {
        questionText: 'Arrange letters',
        options: ['R', 'B', 'I', 'D'],
        correctAnswer: 'BIRD',
        audioUrl: `${BASE_URL}/audio/bird.mp3`
      },
      {
        questionText: 'Arrange letters',
        options: ['T', 'C', 'A'],
        correctAnswer: 'CAT',
        audioUrl: `${BASE_URL}/audio/cat.mp3`
      },
      {
        questionText: 'Arrange letters',
        options: ['G', 'D', 'O'],
        correctAnswer: 'DOG',
        audioUrl: `${BASE_URL}/audio/dog.mp3`
      },
      {
        questionText: 'Arrange letters',
        options: ['P', 'A', 'L', 'E', 'P'],
        correctAnswer: 'APPLE',
        audioUrl: `${BASE_URL}/audio/apple.mp3`
      },
      {
        questionText: 'Arrange letters',
        options: ['H', 'E', 'T', 'A', 'N', 'P', 'L', 'E'],
        correctAnswer: 'ELEPHANT',
        audioUrl: `${BASE_URL}/audio/elephant.mp3`
      }
    ]
  },

  {
    gameName: 'Match Column',
    gameType: 'match_column',
    level: 2,
    order: 3,
    questions: [

      {
        questionText: 'Match uppercase words with lowercase words',
        options: [
          { text: 'APPLE' },
          { text: 'CAT' },
          { text: 'DOG' },
          { text: 'BIRD' }
        ],
        correctAnswer: ['apple', 'cat', 'dog', 'bird']
      },

      {
        questionText: 'Match uppercase animal names with lowercase',
        options: [
          { text: 'ELEPHANT' },
          { text: 'LION' },
          { text: 'TIGER' },
          { text: 'GOAT' }
        ],
        correctAnswer: ['elephant', 'lion', 'tiger', 'goat']
      },

      {
        questionText: 'Match uppercase fruit names with lowercase',
        options: [
          { text: 'APPLE' },
          { text: 'BANANA' },
          { text: 'ORANGE' },
          { text: 'GRAPES' }
        ],
        correctAnswer: ['apple', 'banana', 'orange', 'grapes']
      },

      {
        questionText: 'Match uppercase object names with lowercase',
        options: [
          { text: 'BALL' },
          { text: 'BOOK' },
          { text: 'TABLE' },
          { text: 'CHAIR' }
        ],
        correctAnswer: ['ball', 'book', 'table', 'chair']
      },

      {
        questionText: 'Match uppercase food items with lowercase',
        options: [
          { text: 'MILK' },
          { text: 'BREAD' },
          { text: 'RICE' },
          { text: 'CAKE' }
        ],
        correctAnswer: ['milk', 'bread', 'rice', 'cake']
      }

    ]
  },



  // ✅ SENTENCE FORMATION
  {
    gameName: 'Sentence Formation',
    gameType: 'sentence_formation',
    level: 3,
    order: 1,
    questions: [
      { questionText: 'Rearrange words', options: ['I', 'go', 'to', 'school'], correctAnswer: 'I go to school' },
      { questionText: 'Rearrange words', options: ['She', 'is', 'happy'], correctAnswer: 'She is happy' },
      { questionText: 'Rearrange words', options: ['We', 'play', 'games'], correctAnswer: 'We play games' },
      { questionText: 'Rearrange words', options: ['He', 'likes', 'apples'], correctAnswer: 'He likes apples' },
      { questionText: 'Rearrange words', options: ['They', 'are', 'friends'], correctAnswer: 'They are friends' }
    ]
  },

  // ✅ FILL BLANK
  {
    gameName: 'Fill Blanks',
    gameType: 'fill_in_the_blanks',
    level: 3,
    order: 2,
    questions: [
      { questionText: 'The sun ___ in east', options: ['rise', 'rises'], correctAnswer: 'rises' },
      { questionText: 'I ___ a book', options: ['read', 'reads'], correctAnswer: 'read' },
      { questionText: 'She ___ happy', options: ['is', 'are'], correctAnswer: 'is' },
      { questionText: 'They ___ playing', options: ['is', 'are'], correctAnswer: 'are' },
      { questionText: 'We ___  to school', options: ['go', 'goes'], correctAnswer: 'go' }
    ]
  },

  // ✅ SPELLING
  {
    gameName: 'Spelling Correction',
    gameType: 'spelling_correction',
    level: 3,
    order: 3,
    questions: [
      { questionText: 'Correct BANANNA', correctAnswer: 'BANANA' },
      { questionText: 'Correct APLE', correctAnswer: 'APPLE' },
      { questionText: 'Correct DOOG', correctAnswer: 'DOG' },
      { questionText: 'Correct BIRDD', correctAnswer: 'BIRD' },
      { questionText: 'Correct ELEPHENT', correctAnswer: 'ELEPHANT' }
    ]
  }

];

const seed = async () => {
  await connectDB();

  for (const def of GAME_DEFINITIONS) {
    const { questions, ...gameData } = def;

    const game = await Game.findOneAndUpdate(
      { level: def.level, order: def.order },
      gameData,
      { upsert: true, new: true }
    );

    await Question.deleteMany({ gameId: game._id });

    await Question.insertMany(
      questions.map(q => ({ ...q, gameId: game._id }))
    );
  }

  console.log('✅ SEED SUCCESS');
  mongoose.connection.close();
};

seed();

