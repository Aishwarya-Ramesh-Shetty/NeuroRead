import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import EmptyState from '../../../components/feedback/EmptyState.jsx';
import ErrorBanner from '../../../components/feedback/ErrorBanner.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import { fetchGames } from '../api/gamesApi.js';
import GameCard from '../components/GameCard.jsx';
import { gameTypeMeta } from '../utils/gameTypeMeta.js';
import { extractApiErrorMessage } from '../../../utils/api.js';

function GameDashboardPage() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadGames = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const gamesResponse = await fetchGames();

        if (isMounted) {
          const randomizedGames = [...gamesResponse].sort(() => Math.random() - 0.5);
          setGames(randomizedGames);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(extractApiErrorMessage(error, 'Unable to load games right now.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadGames();

    return () => {
      isMounted = false;
    };
  }, []);

  const difficultyCount = useMemo(
    () =>
      new Set(games.map((game) => gameTypeMeta[game.gameType]?.difficulty).filter(Boolean)).size || 0,
    [games]
  );

  return (
    <section className="space-y-8">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-600 via-sky-500 to-amber-300 px-6 py-8 text-white shadow-2xl shadow-cyan-200/70 sm:px-8"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-amber-200/30 blur-2xl" />
        <div className="relative space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">Games</p>
            <h1 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
              Pick a colorful challenge and start playing.
            </h1>
            <p className="max-w-2xl text-sm text-white/90 sm:text-base">
              Every card leads directly to its game screen and includes a frontend difficulty
              label mapped from the game type.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 backdrop-blur">
              <p className="text-sm text-white/80">Available games</p>
              <p className="mt-1 font-display text-3xl">{games.length}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 backdrop-blur">
              <p className="text-sm text-white/80">Easy to hard</p>
              <p className="mt-1 font-display text-3xl">{difficultyCount}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 backdrop-blur">
              <p className="text-sm text-white/80">Navigation</p>
              <p className="mt-1 font-display text-3xl">1 click</p>
            </div>
          </div>
        </div>
      </motion.div>
      <ErrorBanner message={errorMessage} />
      {isLoading ? (
        <div className="panel flex min-h-60 items-center justify-center">
          <Spinner />
        </div>
      ) : !games.length ? (
        <EmptyState
          title="No games available"
          description="The backend returned an empty game list. Seed the database and refresh."
        />
      ) : (
        <motion.div
          animate="show"
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
        >
          {games.map((game) => (
            <motion.div
              key={game.id}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

export default GameDashboardPage;
