import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import ConfettiBurst from '../../../components/feedback/ConfettiBurst.jsx';
import EmptyState from '../../../components/feedback/EmptyState.jsx';
import { storage } from '../../../lib/storage.js';
import ResultSummary from '../components/ResultSummary.jsx';

function GameResultPage() {
  const location = useLocation();
  const result = location.state?.result ?? storage.getLastResult();

  if (!result) {
    return (
      <EmptyState
        title="No recent game result"
        description="Finish a game first to see the submitted score and saved progress details."
      />
    );
  }

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="relative space-y-6 overflow-hidden"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {result.score > 0 ? <ConfettiBurst /> : null}
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sand">Result</p>
        <h1 className="font-display text-4xl text-ink">{result.gameName} completed</h1>
        <p className="max-w-2xl text-sm text-slate-500">
          Your answers were scored, the attempt was saved, and this result is now available in the
          progress dashboard.
        </p>
      </div>
      <ResultSummary
        attempts={result.totalQuestions}
        score={result.score}
        timeTaken={result.timeTaken}
      />
      <div className="panel grid gap-4 p-5 sm:grid-cols-3">
        <div>
          <p className="text-sm text-slate-500">Correct answers</p>
          <p className="mt-1 font-display text-3xl text-ink">{result.correctAnswers}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Attempt saved</p>
          <p className="mt-1 font-display text-3xl text-ink">
            {result.attemptId ? 'Yes' : 'Saved'}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Submitted</p>
          <p className="mt-1 text-lg font-black text-ink">
            {new Date(result.submittedAt).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          className="inline-flex items-center justify-center rounded-full bg-sea px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
          to="/dashboard"
        >
          Back to dashboard
        </Link>
        <Link
          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          to={`/game/${result.gameId}`}
        >
          Play again
        </Link>
        <Link
          className="inline-flex items-center justify-center rounded-full bg-sand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
          to="/progress"
        >
          View progress
        </Link>
      </div>
    </motion.section>
  );
}

export default GameResultPage;
