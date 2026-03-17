import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ErrorBanner from '../../../components/feedback/ErrorBanner.jsx';
import EmptyState from '../../../components/feedback/EmptyState.jsx';
import Card from '../../../components/ui/Card.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import { fetchProgressSummary } from '../api/progressApi.js';
import { gameTypeMeta } from '../../games/utils/gameTypeMeta.js';
import { extractApiErrorMessage } from '../../../utils/api.js';
import MetricCard from '../components/MetricCard.jsx';
import PerformanceBarChart from '../components/PerformanceBarChart.jsx';
import PerformanceLineChart from '../components/PerformanceLineChart.jsx';

function formatTimeTaken(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (!minutes) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

function ProgressDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await fetchProgressSummary();

        if (isMounted) {
          setSummary(response);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(extractApiErrorMessage(error, 'Unable to load progress right now.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const summaryCards = summary
    ? [
        {
          label: 'Total games played',
          value: summary.overview.totalGamesPlayed,
          helperText: `${summary.overview.totalAttempts} total attempts`,
          accentClassName: 'from-cyan-500 to-teal-400'
        },
        {
          label: 'Average score',
          value: `${summary.overview.averageScore}%`,
          helperText: 'Across all submitted attempts',
          accentClassName: 'from-indigo-500 to-sky-400'
        },
        {
          label: 'Improvement',
          value: `${summary.overview.scoreImprovement >= 0 ? '+' : ''}${summary.overview.scoreImprovement}`,
          helperText: 'Latest average vs first average',
          accentClassName: 'from-fuchsia-500 to-rose-400'
        },
        {
          label: 'Total practice time',
          value: formatTimeTaken(summary.overview.totalTimeTaken),
          helperText: `Best score ${summary.overview.bestScore}%`,
          accentClassName: 'from-amber-400 to-orange-400'
        }
      ]
    : [];

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sea">Progress</p>
        <h1 className="font-display text-4xl text-ink">User progress dashboard</h1>
        <p className="max-w-2xl text-sm text-slate-500">
          Review total attempts, average performance, and how each game type is going over time.
        </p>
      </div>
      <ErrorBanner message={errorMessage} />
      {isLoading ? (
        <div className="panel flex min-h-60 items-center justify-center">
          <Spinner />
        </div>
      ) : !summary ? (
        <EmptyState
          title="No progress yet"
          description="Complete at least one game to populate your progress dashboard."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((item) => (
              <MetricCard key={item.label} {...item} />
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
            <PerformanceLineChart data={summary.performanceTimeline} />
            <PerformanceBarChart data={summary.attemptsByGame} />
          </div>
          <Card>
            <h2 className="font-display text-2xl text-ink">Attempts by game</h2>
            {summary.attemptsByGame.length ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Game</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Attempts</th>
                      <th className="px-4 py-3 font-semibold">Average Score</th>
                      <th className="px-4 py-3 font-semibold">Best Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {summary.attemptsByGame.map((entry) => (
                      <tr key={entry._id}>
                        <td className="px-4 py-3">{entry.gameName}</td>
                        <td className="px-4 py-3">
                          {gameTypeMeta[entry.gameType]?.label ?? entry.gameType}
                        </td>
                        <td className="px-4 py-3">{entry.attempts}</td>
                        <td className="px-4 py-3">{Number(entry.averageScore.toFixed(2))}</td>
                        <td className="px-4 py-3">{entry.bestScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No attempts recorded"
                description="Once you complete a game, its stats will appear here."
              />
            )}
          </Card>
        </>
      )}
    </motion.section>
  );
}

export default ProgressDashboardPage;
