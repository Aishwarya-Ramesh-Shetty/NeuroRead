import { useState } from 'react';
import LetterPronounceText from '../components/LetterPronounceText.jsx';
import OptionButton from '../components/OptionButton.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import ScoreCard from '../components/ScoreCard.jsx';

function FillInTheBlanksGame({ question, questionNumber, totalQuestions, selectedAnswer, onAnswer }) {
  const [internalAnswer, setInternalAnswer] = useState('');
  const activeAnswer = selectedAnswer ?? internalAnswer;

  const submit = (value) => {
    if (selectedAnswer === undefined) {
      setInternalAnswer(value);
    }

    const accepted = (question.acceptedAnswers?.length ? question.acceptedAnswers : [question.correctAnswer]).map((x) => String(x).toLowerCase());
    onAnswer?.({
      selectedAnswer: value,
      correctAnswer: question.correctAnswer,
      isCorrect: accepted.includes(String(value).toLowerCase()),
      isComplete: Boolean(value)
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]">
      <QuestionCard title={`Fill Blank ${questionNumber}/${totalQuestions}`} prompt={question.questionText} helperText="Choose the best word. Click letters for pronunciation.">
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options.map((option) => (
            <OptionButton key={option} isSelected={activeAnswer === option} onClick={() => submit(option)}>
              <LetterPronounceText text={option} />
            </OptionButton>
          ))}
        </div>
      </QuestionCard>
      <ScoreCard title="Fill the blank" subtitle={activeAnswer ? `Selected: ${activeAnswer}` : 'Pick one option'} score={activeAnswer ? 10 : '?'} stats={[{ label: 'Options', value: String(question.options.length) }]} />
    </div>
  );
}

export default FillInTheBlanksGame;
