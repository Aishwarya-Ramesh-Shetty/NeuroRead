import { useMemo, useState } from 'react';
import JumbledLettersBoard from '../components/JumbledLettersBoard.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import ScoreCard from '../components/ScoreCard.jsx';

const defaultQuestion = {
  questionText: 'Rearrange the shuffled letters to form the correct word.',
  imageUrl:
    'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?auto=format&fit=crop&w=900&q=80',
  correctAnswer: 'BIRD',
  shuffledLetters: ['R', 'D', 'B', 'I']
};

function JumbledLettersGame({
  question = defaultQuestion,
  questionNumber = 1,
  totalQuestions = 5,
  selectedAnswer,
  onAnswer,
  value,
  onChange
}) {
  const [internalWord, setInternalWord] = useState([]);
  const selectedTileIds = selectedAnswer ?? value ?? internalWord;
  const letters = question.shuffledLetters ?? question.correctAnswer.split('');

  const updateWord = (nextWord) => {
    if (selectedAnswer === undefined && value === undefined) {
      setInternalWord(nextWord);
    }

    onChange?.(nextWord);

    const nextSelectedWord = nextWord
      .map((tileId) => {
        const index = Number(tileId.split('-').at(-1));
        return letters[index] ?? '';
      })
      .join('');

    onAnswer?.({
      selectedAnswer: nextWord,
      correctAnswer: question.correctAnswer,
      isCorrect: nextWord.length === letters.length && nextSelectedWord === question.correctAnswer,
      isComplete: nextWord.length === letters.length
    });
  };

  const selectedWord = useMemo(
    () =>
      selectedTileIds
        .map((tileId) => {
          const index = Number(tileId.split('-').at(-1));
          return letters[index] ?? '';
        })
        .join(''),
    [letters, selectedTileIds]
  );

  const isComplete = selectedTileIds.length === letters.length;
  const isCorrect = isComplete && selectedWord === question.correctAnswer;

  const status = useMemo(() => {
    if (!selectedTileIds.length) {
      return {
        title: 'Start building',
        subtitle: 'Drag each letter into the answer row to make a word.',
        score: '?',
        accentClassName: 'from-lime-500 via-emerald-500 to-teal-400'
      };
    }

    if (isCorrect) {
      return {
        title: 'Word complete',
        subtitle: `Excellent. You formed "${question.correctAnswer}".`,
        score: 10,
        accentClassName: 'from-emerald-500 via-lime-500 to-yellow-400'
      };
    }

    if (isComplete) {
      return {
        title: 'Rearrange the letters',
        subtitle: `You made "${selectedWord}". Try dragging the letters into a different order.`,
        score: 0,
        accentClassName: 'from-rose-500 via-orange-500 to-amber-400'
      };
    }

    return {
      title: 'Keep going',
      subtitle: `Current word: "${selectedWord || '_'}"`,
      score: selectedTileIds.length,
      accentClassName: 'from-fuchsia-500 via-pink-500 to-orange-400'
    };
  }, [isComplete, isCorrect, question.correctAnswer, selectedTileIds.length, selectedWord]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]">
      <QuestionCard
        title={`Jumbled Letters ${questionNumber}/${totalQuestions}`}
        prompt={question.questionText}
        helperText="Drag letters from the tray into the answer row. Drag again to reorder them."
        imageUrl={question.imageUrl}
      >
        <JumbledLettersBoard
          hint="Build the word by dragging letters into place. Click a placed letter to send it back."
          letters={letters}
          onChange={updateWord}
          title="Drag the letters into the correct order"
          value={selectedTileIds}
        />
      </QuestionCard>

      <div className="space-y-5">
        <ScoreCard
          accentClassName={status.accentClassName}
          score={status.score}
          stats={[
            { label: 'Question', value: `${questionNumber}/${totalQuestions}` },
            { label: 'Letters', value: String(letters.length) },
            { label: 'Current', value: selectedWord || '-' }
          ]}
          subtitle={status.subtitle}
          title={status.title}
        />
        <div className="rounded-[2rem] bg-gradient-to-br from-yellow-100 via-white to-lime-100 p-5 shadow-lg">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-yellow-600">
            Strategy tip
          </p>
          <p className="mt-3 text-xl font-black leading-9 text-ink">
            Look for the first sound in the word, then drag that letter into the first spot before
            building the rest.
          </p>
        </div>
      </div>
    </div>
  );
}

export default JumbledLettersGame;
