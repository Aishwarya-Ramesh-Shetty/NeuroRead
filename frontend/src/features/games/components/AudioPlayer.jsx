
import { useEffect, useRef, useState } from 'react';

function AudioPlayer({
  src,
  title = 'Listen carefully',
  description = 'Play the sound and choose the best answer.',
  accentClassName = 'from-indigo-500 to-sky-500'
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = async () => {
    if (!src) return;

    try {
      // 🔥 Pause existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // 🔥 Create audio with fallback handling
      const audio = new Audio();
      audio.src = src;
      audio.preload = 'auto';

      audioRef.current = audio;

      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
      audio.onerror = () => {
        console.error('Audio failed to load:', src);
        setIsPlaying(false);
      };

      setIsPlaying(true);

      await audio.play();
    } catch (err) {
      console.error('Audio play failed:', err);
      setIsPlaying(false);
    }
  };

  return (
    <div className={`rounded-[2rem] bg-gradient-to-r ${accentClassName} p-[3px] shadow-lg`}>
      <div className="flex flex-col gap-4 rounded-[1.85rem] bg-white/95 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-black uppercase tracking-[0.26em] text-indigo-500">
            Audio
          </p>
          <h3 className="text-2xl font-black text-ink">{title}</h3>
          <p className="text-lg leading-8 text-slate-600">{description}</p>
        </div>

        <button
          className="inline-flex min-w-40 items-center justify-center rounded-full bg-indigo-500 px-6 py-4 text-xl font-black text-white shadow-lg transition hover:bg-indigo-600"
          onClick={toggleAudio}
          type="button"
        >
          {isPlaying ? 'Pause Audio' : 'Play Audio'}
        </button>
      </div>
    </div>
  );
}

export default AudioPlayer;

