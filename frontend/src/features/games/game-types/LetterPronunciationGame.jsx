import { useEffect, useMemo, useState } from 'react';
import QuestionCard from '../components/QuestionCard.jsx';
import ScoreCard from '../components/ScoreCard.jsx';

const defaultQuestion = {
  questionText: 'Look at the letter and choose the sound that matches it.',
  letter: 'B',
  soundOptions: [
    { id: 'sound-1', label: 'Sound 1', spokenText: 'bee' },
    { id: 'sound-2', label: 'Sound 2', spokenText: 'dee' },
    { id: 'sound-3', label: 'Sound 3', spokenText: 'pee' }
  ],
  correctAnswer: 'sound-1'
};

function LetterPronunciationGame({
  question = defaultQuestion,
  questionNumber = 1,
  totalQuestions = 5,
  selectedAnswer,
  onAnswer,
  disabled = false
}) {
  const [internalAnswer, setInternalAnswer] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  const activeAnswer = selectedAnswer ?? internalAnswer;
  const isAnswered = Boolean(activeAnswer);
  const isCorrect = isAnswered && activeAnswer === question.correctAnswer;
  const correctOption = question.soundOptions.find((option) => option.id === question.correctAnswer);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const status = useMemo(() => {
    if (!isAnswered) {
      return {
        title: 'Listen for the letter sound',
        subtitle: 'Play the sounds, then choose the one that matches the letter.',
        score: '?',
        accentClassName: 'from-violet-500 via-fuchsia-500 to-pink-400'
      };
    }

    if (isCorrect) {
      return {
        title: 'Great sound match',
        subtitle: `Correct. The letter ${question.letter} matches that pronunciation.`,
        score: 10,
        accentClassName: 'from-emerald-500 via-lime-500 to-yellow-400'
      };
    }

    return {
      title: 'Try another sound',
      subtitle: `The correct sound was ${correctOption?.label ?? 'the correct option'}.`,
      score: 0,
      accentClassName: 'from-rose-500 via-orange-500 to-amber-400'
    };
  }, [correctOption?.label, isAnswered, isCorrect, question.letter]);

  const handleOptionSelect = (optionId) => {
    if (disabled) {
      return;
    }

    if (selectedAnswer === undefined) {
      setInternalAnswer(optionId);
    }

    onAnswer?.({
      selectedAnswer: optionId,
      correctAnswer: question.correctAnswer,
      isCorrect: optionId === question.correctAnswer,
      isComplete: true
    });
  };

  const playSound = (spokenText, optionId) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.onstart = () => setPlayingId(optionId);
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.95fr)]">
      <QuestionCard
        title={`Letter Sound ${questionNumber}/${totalQuestions}`}
        prompt={question.questionText}
        helperText="Tap a play button to hear a sound, then choose the sound that matches the letter."
      >
        <div className="rounded-[2rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-400 p-6 text-center text-white shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-white/80">
            Letter Card
          </p>
          <div className="mt-4 text-8xl font-black leading-none sm:text-9xl">{question.letter}</div>
          <p className="mt-4 text-lg font-bold text-white/90">
            Choose the pronunciation that sounds right for this letter.
          </p>
        </div>

        <div className="grid gap-4">
          {question.soundOptions.map((option) => (
            <div
              key={option.id}
              className={[
                'rounded-[1.75rem] border-4 p-5 shadow-md transition',
                isAnswered && option.id === question.correctAnswer
                  ? 'border-emerald-300 bg-emerald-100 text-emerald-900'
                  : isAnswered && activeAnswer === option.id && option.id !== question.correctAnswer
                    ? 'border-rose-300 bg-rose-100 text-rose-900'
                    : activeAnswer === option.id
                      ? 'border-sky-300 bg-sky-100 text-sky-900'
                      : 'border-white/90 bg-white text-slate-700'
              ].join(' ')}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-2xl font-black">{option.label}</p>
                  <p className="mt-1 text-base font-bold text-slate-500">
                    Listen first, then tap anywhere on this card to choose it.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-base font-black text-white transition hover:bg-slate-700"
                    onClick={() => playSound(option.spokenText, option.id)}
                    type="button"
                  >
                    {playingId === option.id ? 'Playing...' : 'Play Sound'}
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-base font-black text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={disabled}
                    onClick={() => handleOptionSelect(option.id)}
                    type="button"
                  >
                    Choose Sound
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </QuestionCard>

      <div className="space-y-5">
        <ScoreCard
          accentClassName={status.accentClassName}
          score={status.score}
          stats={[
            { label: 'Question', value: `${questionNumber}/${totalQuestions}` },
            { label: 'Letter', value: question.letter },
            { label: 'Sounds', value: String(question.soundOptions.length) }
          ]}
          subtitle={status.subtitle}
          title={status.title}
        />
        <div className="rounded-[2rem] bg-gradient-to-br from-pink-100 via-white to-violet-100 p-5 shadow-lg">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-violet-600">Sound tip</p>
          <p className="mt-3 text-xl font-black leading-9 text-ink">
            Repeat the sound aloud after pressing play. Hearing it and saying it together can make
            the letter easier to remember.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LetterPronunciationGame;
