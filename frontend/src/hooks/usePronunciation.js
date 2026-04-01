import { useCallback, useRef } from 'react';
import { fetchPronunciationByLetter } from '../features/games/api/pronunciationApi.js';

export function usePronunciation() {
  const cacheRef = useRef(new Map());
  const activeAudioRef = useRef(null);

  const playLetter = useCallback(async (letter) => {
    const normalized = String(letter || '').trim().charAt(0).toUpperCase();

    if (!/[A-Z]/.test(normalized)) {
      return;
    }

    let audioUrl = cacheRef.current.get(normalized);

    if (!audioUrl) {
      const response = await fetchPronunciationByLetter(normalized);
      audioUrl = response.audioUrl;
      cacheRef.current.set(normalized, audioUrl);
    }

    if (!audioUrl) {
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    activeAudioRef.current = audio;
    await audio.play();
  }, []);

  return { playLetter };
}

export default usePronunciation;
