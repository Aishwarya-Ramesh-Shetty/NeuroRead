import { useState } from 'react';
import { usePronunciation } from '../hooks/usePronunciation.js';

function LetterPronounceText({ text, className = '', stopPropagation = true }) {
  const [loadingLetter, setLoadingLetter] = useState('');
  const { playLetter } = usePronunciation();

  const handleLetterClick = async (event, letter) => {
    if (stopPropagation) {
      event.stopPropagation();
    }

    if (!/[a-z]/i.test(letter)) {
      return;
    }

    try {
      setLoadingLetter(letter);
      await playLetter(letter);
    } catch {
      // Ignore pronunciation failures and keep game interaction responsive.
    } finally {
      setLoadingLetter('');
    }
  };

  return (
    <span className={className}>
      {String(text).split('').map((char, index) => (
        <button
          key={`${char}-${index}`}
          className="inline rounded px-0.5 transition hover:bg-slate-200/70"
          disabled={loadingLetter === char}
          onClick={(event) => handleLetterClick(event, char)}
          type="button"
        >
          {char}
        </button>
      ))}
    </span>
  );
}

export default LetterPronounceText;
