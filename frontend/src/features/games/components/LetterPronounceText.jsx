import { useRef, useState } from 'react';
import { fetchPronunciationByLetter } from '../api/pronunciationApi.js';

function LetterPronounceText({ text, className = '', stopPropagation = true }) {
  const [loadingLetter, setLoadingLetter] = useState('');
  const audioRef = useRef(null);

  const handleLetterClick = async (event, letter) => {
    if (stopPropagation) {
      event.stopPropagation();
    }

    if (!/[a-z]/i.test(letter)) {
      return;
    }

    try {
      setLoadingLetter(letter);
      const result = await fetchPronunciationByLetter(letter.toUpperCase());

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(result.audioUrl);
      audioRef.current = audio;
      await audio.play();
    } catch {
      // Silent fallback: selection/game play should still work if pronunciation audio fails.
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
