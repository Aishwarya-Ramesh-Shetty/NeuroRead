
import { useState } from 'react';
import { usePronunciation } from '../hooks/usePronunciation.js';

function LetterPronounceText({ text, className = '', stopPropagation = true }) {
  const [loadingLetter, setLoadingLetter] = useState('');
  const { playLetter } = usePronunciation();

  const handleLetterClick = async (event, letter) => {
    if (stopPropagation) {
      event.stopPropagation(); // ✅ prevents parent button click
    }

    if (!/[a-z]/i.test(letter)) return;

    try {
      setLoadingLetter(letter);
      await playLetter(letter);
    } catch {
      // ignore errors
    } finally {
      setLoadingLetter('');
    }
  };

  return (
    <span className={className}>
      {String(text).split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={`inline px-0.5 rounded cursor-pointer transition hover:bg-slate-200/70 ${
            loadingLetter === char ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={(event) => handleLetterClick(event, char)}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export default LetterPronounceText;

