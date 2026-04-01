import { useCallback, useRef } from 'react';
import { fetchPronunciationByLetter } from '../api/pronunciationApi.js';

export function usePronunciation() {
  const cacheRef = useRef(new Map());
  const activeAudioRef = useRef(null);

  const playLetter = useCallback(async (letter) => {
    const normalized = String(letter || '').trim().charAt(0).toUpperCase();

    if (!/[A-Z]/.test(normalized)) {
      return;
    }

    try {
      let audioUrl = cacheRef.current.get(normalized);

      if (!audioUrl) {
        const response = await fetchPronunciationByLetter(normalized);
        audioUrl = response.audioUrl;
        cacheRef.current.set(normalized, audioUrl);
      }

      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      activeAudioRef.current = audio;
      await audio.play();
    } catch {
      // Soft-fail: game interaction should continue even if pronunciation fails.
    }
  }, []);

  return { playLetter };
}

export default usePronunciation;
