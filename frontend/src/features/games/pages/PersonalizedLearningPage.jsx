import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../../components/feedback/EmptyState.jsx';
import ErrorBanner from '../../../components/feedback/ErrorBanner.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import { fetchPersonalizedGames } from '../api/gamesApi.js';
import { gameTypeMeta } from '../utils/gameTypeMeta.js';
import { extractApiErrorMessage } from '../../../utils/api.js';

function PersonalizedLearningPage() {
  const [data, setData] = useState({ currentLevel: 1, games: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadPersonalized = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await fetchPersonalizedGames();

        if (mounted) {
          setData(response);
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(
            extractApiErrorMessage(error, 'Unable to load personalized learning right now.')
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadPersonalized();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 p-6 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.22em]">Personalized path</p>
        <h1 className="mt-2 text-3xl font-black">Current level: {data.currentLevel}</h1>
        <p className="mt-2 text-sm text-white/90">
          Locked games are disabled until you complete the previous game.
        </p>
      </div>

      <ErrorBanner message={errorMessage} />

      {isLoading ? (
        <div className="panel flex min-h-60 items-center justify-center">
          <Spinner />
        </div>
      ) : !data.games.length ? (
        <EmptyState
          title="No personalized games found"
          description="Seed game data in the backend, then refresh this page."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.games.map((game) => {
            const isLocked = game.isLocked;
            const meta = gameTypeMeta[game.gameType];

            return (
              <div
                key={game.id}
                className={`rounded-2xl border p-5 shadow-sm ${
                  isLocked ? 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-70' : 'border-white bg-white'
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-black text-ink">{game.gameName}</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
                    Level {game.level}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{game.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="space-x-2">
                    <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-800">
                      {meta?.label ?? game.gameType}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        game.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {game.isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  {isLocked ? (
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                      Locked
                    </span>
                  ) : (
                    <Link
                      className="rounded-full bg-sea px-4 py-2 text-sm font-bold text-white"
                      to={`/game/${game.id}`}
                      state={{ game, personalized: true }}
                    >
                      Play
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default PersonalizedLearningPage;
