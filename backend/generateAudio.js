
import gTTS from 'gtts';
import fs from 'fs';
import path from 'path';

const audioDir = './public/audio';

// ✅ ensure directory exists
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// 🔊 generate audio safely
const generateAudio = (text, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(audioDir, `${filename}.mp3`);

    // ✅ skip if already exists (important)
    if (fs.existsSync(filePath)) {
      console.log(`⏭️ Skipped (exists): ${filename}.mp3`);
      return resolve();
    }

    const gtts = new gTTS(text, 'en');

    gtts.save(filePath, (err) => {
      if (err) {
        console.error(`❌ Error generating ${filename}:`, err);
        reject(err);
      } else {
        console.log(`✅ Generated: ${filename}.mp3`);
        resolve();
      }
    });
  });
};

// 🔥 WORDS USED IN YOUR PROJECT
const WORDS = [
  // 'elephant',
  // 'bird',
  'apple',
  'cat',
  'dog'
];

// 🔥 SENTENCE WORDS (optional but useful)
const SENTENCES = [
  'I go to school',
  'She is happy',
  'We play games',
  'He likes apples',
  'They are friends'
];

// 🔤 generate A–Z letters
// const generateAlphabet = async () => {
//   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//   for (const letter of letters) {
//     await generateAudio(letter, letter.toLowerCase());
//   }

//   console.log('🔤 A–Z completed');
// };

// 🧠 generate words
const generateWords = async () => {
  for (const word of WORDS) {
    await generateAudio(word, word);
  }

  console.log('🧠 Words completed');
};

// 🗣️ generate sentences (optional)
const generateSentences = async () => {
  for (const sentence of SENTENCES) {
    const fileName = sentence.toLowerCase().replace(/\s+/g, '_');
    await generateAudio(sentence, fileName);
  }

  console.log('🗣️ Sentences completed');
};

// 🚀 run all
const run = async () => {
  try {
    console.log('🚀 Generating audio...\n');

    // await generateAlphabet();
    await generateWords();
    await generateSentences(); // optional

    console.log('\n🎉 ALL AUDIO GENERATED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Error:', err);
  }
};

run();

