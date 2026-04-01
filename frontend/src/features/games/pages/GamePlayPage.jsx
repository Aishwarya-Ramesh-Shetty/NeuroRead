import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import EmptyState from '../../../components/feedback/EmptyState.jsx';
import ErrorBanner from '../../../components/feedback/ErrorBanner.jsx';
import Button from '../../../components/ui/Button.jsx';
import Spinner from '../../../components/ui/Spinner.jsx';
import { createAttempt } from '../../progress/api/progressApi.js';
import { fetchGames, fetchGameQuestions } from '../api/gamesApi.js';
import GameHeader from '../components/GameHeader.jsx';
import { gameRendererMap } from '../engines/gameRendererMap.js';
import { useSoundEffects } from '../hooks/useSoundEffects.js';
import { normalizeQuestionByGameType, isAnswerComplete } from '../utils/normalizeQuestion.js';
import { extractApiErrorMessage } from '../../../utils/api.js';
import { storage } from '../../../lib/storage.js';

function GamePlayPage() {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const startedAtRef = useRef(Date.now());
  const isPersonalizedFlow = Boolean(location.state?.personalized);
  const soundEffects = useSoundEffects();

  const [game, setGame] = useState(location.state?.game ?? null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadGameSession = async () => {
      setIsLoading(true);
      setLoadError('');
      setSubmitError('');

      try {
        const [gamesResponse, questionsResponse] = await Promise.all([
          fetchGames(),
          fetchGameQuestions(gameId, isPersonalizedFlow)
        ]);

        const activeGame =
          location.state?.game ?? gamesResponse.find((gameItem) => gameItem.id === gameId) ?? null;

        if (!activeGame) {
          throw new Error('Game details could not be found.');
        }

        const normalizedQuestions = questionsResponse.map((question) =>
          normalizeQuestionByGameType(activeGame.gameType, question)
        );

        if (isMounted) {
          setGame(activeGame);
          setQuestions(normalizedQuestions);
          setAnswers(Array(normalizedQuestions.length).fill(null));
          setCurrentIndex(0);
          startedAtRef.current = Date.now();
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(extractApiErrorMessage(error, 'Unable to load this game right now.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadGameSession();

    return () => {
      isMounted = false;
    };
  }, [gameId, isPersonalizedFlow, location.state?.game?.id]);

  const currentQuestion = questions[currentIndex] ?? null;
  const currentAnswer = answers[currentIndex] ?? null;
  const correctAnswers = answers.filter((answer) => answer?.isCorrect).length;
  const answeredQuestions = answers.filter(Boolean).length;

  const isCurrentAnswerComplete = useMemo(() => {
    if (!game || !currentQuestion) {
      return false;
    }

    return isAnswerComplete(game.gameType, currentQuestion, currentAnswer);
  }, [currentAnswer, currentQuestion, game]);

  const handleAnswer = (payload) => {
    const previousAnswer = answers[currentIndex];

    if (payload?.isCorrect && !previousAnswer?.isCorrect) {
      soundEffects.playCorrect();
    }

    setAnswers((currentAnswers) => {
      const nextAnswers = [...currentAnswers];
      nextAnswers[currentIndex] = payload;
      return nextAnswers;
    });
  };

  const handleSubmitGame = async () => {
    if (!game) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const score = questions.length ? Math.round((correctAnswers / questions.length) * 100) : 0;
    const timeTaken = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));

    try {
      const accuracy = questions.length ? Number(((correctAnswers / questions.length) * 100).toFixed(2)) : 0;

      const attempt = await createAttempt({
        gameId: game.id,
        score,
        timeTaken,
        accuracy,
        isCompleted: true
      });

      const result = {
        gameId: game.id,
        gameName: game.gameName,
        gameType: game.gameType,
        score,
        timeTaken,
        totalQuestions: questions.length,
        correctAnswers,
        answeredQuestions,
        attemptId: attempt._id ?? attempt.id ?? null,
        submittedAt: new Date().toISOString()
      };

      storage.setLastResult(result);
      navigate(`/game/${game.id}/result`, {
        replace: true,
        state: { result }
      });
    } catch (error) {
      setSubmitError(extractApiErrorMessage(error, 'Unable to save your progress right now.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="panel flex min-h-72 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <ErrorBanner message={loadError} />
        <Button onClick={() => navigate('/dashboard')} type="button" variant="secondary">
          Back to dashboard
        </Button>
      </div>
    );
  }

  if (!game || !questions.length || !currentQuestion) {
    return (
      <EmptyState
        title="No questions available"
        description="This game does not have any playable questions yet. Seed the backend and try again."
      />
    );
  }

  const Renderer = gameRendererMap[game.gameType];
  const progressValue = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  if (!Renderer) {
    return (
      <EmptyState
        title="Unsupported game type"
        description="This game type is not yet connected to a frontend renderer."
      />
    );
  }

  return (
    <section className="space-y-6">
      <GameHeader
        description={game.description}
        progress={progressValue}
        title={game.gameName}
      />
      <ErrorBanner message={submitError} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id ?? currentIndex}
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 22 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          exit={{ opacity: 0, x: -22 }}
        >
          <Renderer
            disabled={isSubmitting}
            onAnswer={handleAnswer}
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            selectedAnswer={currentAnswer?.selectedAnswer}
            totalQuestions={questions.length}
          />
        </motion.div>
      </AnimatePresence>
      <div className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
            Session progress
          </p>
          <p className="text-lg font-black text-ink">
            Answered {answeredQuestions} of {questions.length} questions
          </p>
          <p className="text-sm text-slate-500">Correct so far: {correctAnswers}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            disabled={currentIndex === 0 || isSubmitting}
            onClick={() => setCurrentIndex((current) => Math.max(0, current - 1))}
            type="button"
            variant="secondary"
          >
            Previous
          </Button>
          {!isLastQuestion ? (
            <Button
              disabled={!isCurrentAnswerComplete || isSubmitting}
              onClick={() => setCurrentIndex((current) => current + 1)}
              type="button"
            >
              Next Question
            </Button>
          ) : (
            <Button
              disabled={!isCurrentAnswerComplete || isSubmitting}
              onClick={handleSubmitGame}
              type="button"
            >
              {isSubmitting ? 'Saving progress...' : 'Submit Answers'}
            </Button>
          )}
          <Link
            className="inline-flex items-center justify-center rounded-full bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            to="/dashboard"
          >
            Exit Game
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GamePlayPage;
