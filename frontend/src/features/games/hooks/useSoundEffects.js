import { useMemo } from 'react';

function playToneSequence(sequence) {
  if (typeof window === 'undefined') {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const masterGain = context.createGain();
  masterGain.gain.value = 0.08;
  masterGain.connect(context.destination);

  const now = context.currentTime;

  sequence.forEach((note, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = note.type ?? 'triangle';
    oscillator.frequency.setValueAtTime(note.frequency, now + note.start);
    gain.gain.setValueAtTime(0.0001, now + note.start);
    gain.gain.exponentialRampToValueAtTime(0.22, now + note.start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(now + note.start);
    oscillator.stop(now + note.start + note.duration + 0.04);

    if (index === sequence.length - 1) {
      oscillator.onended = () => {
        context.close().catch(() => {});
      };
    }
  });
}

export function useSoundEffects() {
  return useMemo(
    () => ({
      playCorrect() {
        playToneSequence([
          { frequency: 523.25, start: 0, duration: 0.16 },
          { frequency: 659.25, start: 0.12, duration: 0.18 },
          { frequency: 783.99, start: 0.24, duration: 0.22 }
        ]);
      }
    }),
    []
  );
}
