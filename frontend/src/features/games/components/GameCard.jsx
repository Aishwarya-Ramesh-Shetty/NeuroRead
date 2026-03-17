import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../../components/ui/Card.jsx';
import { gameTypeMeta } from '../utils/gameTypeMeta.js';

function GameCard({
  game,
  title,
  description,
  difficulty,
  gameType,
  accentClassName,
  onPlay,
  to,
  playLabel = 'Play'
}) {
  const navigate = useNavigate();
  const resolvedGameType = gameType ?? game?.gameType;
  const meta = gameTypeMeta[resolvedGameType] ?? {
    label: 'Learning Game',
    accent: 'from-cyan-500 via-sky-500 to-teal-500',
    difficulty: 'Medium',
    difficultyTone: 'bg-sky-100 text-sky-700'
  };
  const resolvedTitle = title ?? game?.gameName ?? 'Untitled Game';
  const resolvedDescription =
    description ?? game?.description ?? 'A playful activity designed for focused learning.';
  const resolvedDifficulty = difficulty ?? meta.difficulty;
  const targetPath = to ?? (game?.id ? `/game/${game.id}` : null);

  const openGame = () => {
    if (onPlay) {
      onPlay(game);
      return;
    }

    if (targetPath) {
      navigate(targetPath, {
        state: {
          game
        }
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openGame();
    }
  };

  return (
    <Card
      className="group relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden border-white/80 bg-white/85 transition duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/80"
      onClick={openGame}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/20 blur-2xl"
        transition={{ duration: 4.5, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        whileHover={{ rotate: -1, scale: 1.02 }}
        className={`rounded-3xl bg-gradient-to-br ${accentClassName ?? meta.accent} px-5 py-6 text-left text-white shadow-lg`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            {meta.label}
          </p>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${meta.difficultyTone} shadow-sm`}
          >
            {resolvedDifficulty}
          </span>
        </div>
        <h3 className="mt-3 font-display text-2xl leading-tight">{resolvedTitle}</h3>
      </motion.div>
      <div className="flex flex-1 flex-col gap-4">
        <p className="flex-1 text-sm leading-6 text-slate-600">{resolvedDescription}</p>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">Difficulty:</span> {resolvedDifficulty}
          </div>
          <button
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openGame();
            }}
          >
            {playLabel}
          </button>
        </div>
      </div>
      <span
        className="pointer-events-none absolute inset-x-6 bottom-0 h-1 rounded-full bg-gradient-to-r opacity-0 transition group-hover:opacity-100"
        style={{
          backgroundImage:
            resolvedGameType === 'picture_mcq'
              ? 'linear-gradient(to right, #06b6d4, #14b8a6)'
              : resolvedGameType === 'match_column'
                ? 'linear-gradient(to right, #fb923c, #facc15)'
                : resolvedGameType === 'pronunciation_selection'
                  ? 'linear-gradient(to right, #6366f1, #0ea5e9)'
                  : resolvedGameType === 'jumbled_letters'
                    ? 'linear-gradient(to right, #ec4899, #f43f5e)'
                    : 'linear-gradient(to right, #84cc16, #10b981)'
        }}
      />
    </Card>
  );
}

export default GameCard;
