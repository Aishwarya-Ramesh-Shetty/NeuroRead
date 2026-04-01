import { useMemo, useState } from 'react';
import LetterPronounceText from '../components/LetterPronounceText.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import ScoreCard from '../components/ScoreCard.jsx';

function SentenceFormationGame({ question, questionNumber, totalQuestions, selectedAnswer, onAnswer }) {
  const [internalIds, setInternalIds] = useState([]);
  const words = question.words || [];
  const chosenIds = selectedAnswer ?? internalIds;

  const buildSentence = (ids) =>
    ids
      .map((id) => words[Number(id)] || '')
      .join(' ')
      .trim();

  const updateIds = (nextIds) => {
    if (selectedAnswer === undefined) {
      setInternalIds(nextIds);
    }

    const formed = buildSentence(nextIds);
    onAnswer?.({
      selectedAnswer: nextIds,
      correctAnswer: question.correctAnswer,
      isCorrect: formed.toLowerCase() === String(question.correctAnswer).trim().toLowerCase(),
      isComplete: nextIds.length === words.length
    });
  };

  const selectedSentence = buildSentence(chosenIds);
  const availableIds = words.map((_, idx) => String(idx)).filter((id) => !chosenIds.includes(id));

  const status = useMemo(
    () => ({
      title: 'Arrange words',
      subtitle: selectedSentence || 'Tap words in order to form a sentence.',
      score: chosenIds.length ? chosenIds.length : '?'
    }),
    [chosenIds.length, selectedSentence]
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]">
      <QuestionCard
        title={`Sentence ${questionNumber}/${totalQuestions}`}
        prompt={question.questionText}
        helperText="Tap words in order. Click any letter for pronunciation."
      >
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="mb-2 text-sm text-slate-500">Your sentence</p>
          <div className="flex min-h-16 flex-wrap gap-2">
            {chosenIds.map((id) => (
              <button
                key={id}
                className="rounded-full bg-sea px-3 py-2 text-white"
                onClick={() => updateIds(chosenIds.filter((x) => x !== id))}
                type="button"
              >
                <LetterPronounceText text={words[Number(id)]} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableIds.map((id) => (
            <button
              key={id}
              className="rounded-full bg-white px-3 py-2 font-bold text-ink shadow"
              onClick={() => updateIds([...chosenIds, id])}
              type="button"
            >
              <LetterPronounceText text={words[Number(id)]} />
            </button>
          ))}
        </div>
      </QuestionCard>

      <ScoreCard
        score={status.score}
        stats={[{ label: 'Words', value: String(words.length) }]}
        subtitle={status.subtitle}
        title={status.title}
      />
    </div>
  );
}

export default SentenceFormationGame;
