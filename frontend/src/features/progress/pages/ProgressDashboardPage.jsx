import { useEffect, useMemo, useState } from 'react';
import ErrorBanner from '../../../components/feedback/ErrorBanner.jsx';
import EmptyState from '../../../components/feedback/EmptyState.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import Card from '../../../components/ui/Card.jsx';
import { fetchProgressSummary } from '../api/progressApi.js';
import { gameTypeMeta } from '../../games/utils/gameTypeMeta.js';
import { extractApiErrorMessage } from '../../../utils/api.js';

function formatPercent(value) {
  return `${Number(value || 0).toFixed(2)}%`;
}

function ProgressDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await fetchProgressSummary();

        if (mounted) {
          setSummary(response);
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(extractApiErrorMessage(error, 'Unable to load progress summary.'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const recentAttempts = useMemo(() => (summary?.attemptsByGame || []).slice(0, 5), [summary]);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sea">Progress</p>
        <h1 className="font-display text-4xl text-ink">Your progress dashboard</h1>
      </div>

      <ErrorBanner message={errorMessage} />

      {isLoading ? (
        <div className="panel flex min-h-60 items-center justify-center">
          <Spinner />
        </div>
      ) : !summary ? (
        <EmptyState
          title="No progress data"
          description="Play at least one game to generate your progress summary."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <p className="text-sm text-slate-500">Total games played</p>
              <p className="mt-2 text-3xl font-black text-ink">{summary.attemptsByGame.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Average score</p>
              <p className="mt-2 text-3xl font-black text-ink">{formatPercent(summary.overview.averageScore)}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Completed levels</p>
              <p className="mt-2 text-3xl font-black text-ink">{Math.max(0, summary.progression.currentLevel - 1)}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Total attempts</p>
              <p className="mt-2 text-3xl font-black text-ink">{summary.overview.totalAttempts}</p>
            </Card>
          </div>

          <Card>
            <h2 className="text-2xl font-black text-ink">Recent attempts</h2>
            {!recentAttempts.length ? (
              <p className="mt-3 text-sm text-slate-500">No attempts found.</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Game</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Attempts</th>
                      <th className="px-4 py-3 font-semibold">Average</th>
                      <th className="px-4 py-3 font-semibold">Best</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {recentAttempts.map((item) => (
                      <tr key={item._id}>
                        <td className="px-4 py-3">{item.gameName}</td>
                        <td className="px-4 py-3">{gameTypeMeta[item.gameType]?.label || item.gameType}</td>
                        <td className="px-4 py-3">{item.attempts}</td>
                        <td className="px-4 py-3">{formatPercent(item.averageScore)}</td>
                        <td className="px-4 py-3">{item.bestScore}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </section>
  );
}

export default ProgressDashboardPage;
