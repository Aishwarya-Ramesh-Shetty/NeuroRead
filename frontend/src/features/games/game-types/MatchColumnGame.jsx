import { useMemo, useState } from 'react';
import MatchColumnBoard from '../components/MatchColumnBoard.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import ScoreCard from '../components/ScoreCard.jsx';

const defaultQuestion = {
  questionText: 'Match each item from the left column to the correct word on the right.',
  leftItems: [
    { id: 'apple', label: 'Apple' },
    { id: 'ball', label: 'Ball' },
    { id: 'cat', label: 'Cat' },
    { id: 'dog', label: 'Dog' }
  ],
  rightItems: [
    { id: 'word-dog', label: 'Dog' },
    { id: 'word-cat', label: 'Cat' },
    { id: 'word-ball', label: 'Ball' },
    { id: 'word-apple', label: 'Apple' }
  ],
  correctMatches: {
    apple: 'word-apple',
    ball: 'word-ball',
    cat: 'word-cat',
    dog: 'word-dog'
  }
};

function MatchColumnGame({
  question = defaultQuestion,
  questionNumber = 1,
  totalQuestions = 5,
  selectedAnswer,
  onAnswer,
  value,
  onChange
}) {
  const [internalMatches, setInternalMatches] = useState({});
  const matches = selectedAnswer ?? value ?? internalMatches;
  const totalPairs = question.leftItems.length;

  const updateMatches = (nextMatches) => {
    if (selectedAnswer === undefined && value === undefined) {
      setInternalMatches(nextMatches);
    }

    onChange?.(nextMatches);

    const nextCorrectPairs = Object.entries(nextMatches).filter(
      ([leftId, rightId]) => question.correctMatches[leftId] && question.correctMatches[leftId] === rightId
    ).length;

    onAnswer?.({
      selectedAnswer: nextMatches,
      correctAnswer: question.correctMatches,
      isCorrect: Object.keys(nextMatches).length === totalPairs && nextCorrectPairs === totalPairs,
      isComplete: Object.keys(nextMatches).length === totalPairs
    });
  };

  const completedPairs = Object.keys(matches).length;
  const correctPairs = useMemo(
    () =>
      Object.entries(matches).filter(
        ([leftId, rightId]) => question.correctMatches[leftId] && question.correctMatches[leftId] === rightId
      ).length,
    [matches, question.correctMatches]
  );

  const status = useMemo(() => {
    if (!completedPairs) {
      return {
        title: 'Start matching',
        subtitle: 'Drag each left card onto the matching word.',
        score: 0,
        accentClassName: 'from-sky-500 via-cyan-500 to-teal-400'
      };
    }

    if (completedPairs === totalPairs && correctPairs === totalPairs) {
      return {
        title: 'Perfect match',
        subtitle: 'Every pair is correct. Excellent work.',
        score: 10,
        accentClassName: 'from-emerald-500 via-lime-500 to-amber-400'
      };
    }

    return {
      title: 'Keep matching',
      subtitle: `${correctPairs} of ${totalPairs} pairs are correct so far.`,
      score: correctPairs * 2,
      accentClassName: 'from-fuchsia-500 via-rose-500 to-orange-400'
    };
  }, [completedPairs, correctPairs, totalPairs]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.85fr)]">
      <QuestionCard
        title={`Match Question ${questionNumber}/${totalQuestions}`}
        prompt={question.questionText}
        helperText="Match left words with the right targets. Click letters to hear pronunciation."
      >
        <MatchColumnBoard
          leftItems={question.leftItems}
          onChange={updateMatches}
          rightItems={question.rightItems}
          title="Drag and drop to connect the pairs"
          value={matches}
        />
      </QuestionCard>

      <div className="space-y-5">
        <ScoreCard
          accentClassName={status.accentClassName}
          score={status.score}
          stats={[
            { label: 'Correct', value: `${correctPairs}/${totalPairs}` },
            { label: 'Matched', value: `${completedPairs}/${totalPairs}` },
            { label: 'Mode', value: 'Drag' }
          ]}
          subtitle={status.subtitle}
          title={status.title}
        />
        <div className="rounded-[2rem] bg-gradient-to-br from-sky-100 via-white to-violet-100 p-5 shadow-lg">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-sky-600">How to play</p>
          <ol className="mt-3 space-y-3 text-lg font-black leading-8 text-ink">
            <li>1. Grab a card from the left column.</li>
            <li>2. Drop it onto the correct word on the right.</li>
            <li>3. Clear and try again if you want to change a match.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default MatchColumnGame;
