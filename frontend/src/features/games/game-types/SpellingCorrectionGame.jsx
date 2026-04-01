import { useState } from 'react';
import LetterPronounceText from '../components/LetterPronounceText.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import ScoreCard from '../components/ScoreCard.jsx';

function SpellingCorrectionGame({ question, questionNumber, totalQuestions, selectedAnswer, onAnswer }) {
  const [internalValue, setInternalValue] = useState('');
  const value = selectedAnswer ?? internalValue;

  const handleChange = (next) => {
    if (selectedAnswer === undefined) {
      setInternalValue(next);
    }

    const accepted = (question.acceptedAnswers?.length ? question.acceptedAnswers : [question.correctAnswer]).map((x) => String(x).toLowerCase());

    onAnswer?.({
      selectedAnswer: next,
      correctAnswer: question.correctAnswer,
      isCorrect: accepted.includes(String(next).trim().toLowerCase()),
      isComplete: Boolean(String(next).trim())
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]">
      <QuestionCard title={`Spelling ${questionNumber}/${totalQuestions}`} prompt={question.questionText} helperText="Type the corrected spelling. Click letters in prompt word for pronunciation.">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Incorrect word</p>
          <p className="mt-1 text-2xl font-black text-rose-600">
            <LetterPronounceText text={question.incorrectWord || ''} />
          </p>
        </div>
        <input className="w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Type corrected word" value={value} onChange={(e) => handleChange(e.target.value)} />
      </QuestionCard>
      <ScoreCard title="Correct the spelling" subtitle={value ? `Your answer: ${value}` : 'Enter corrected spelling'} score={value ? 10 : '?'} stats={[{ label: 'Expected', value: question.correctAnswer }]} />
    </div>
  );
}

export default SpellingCorrectionGame;
