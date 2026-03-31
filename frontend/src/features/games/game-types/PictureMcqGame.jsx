import { useMemo, useState } from 'react';
import AudioPlayer from '../components/AudioPlayer.jsx';
import OptionButton from '../components/OptionButton.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import LetterPronounceText from '../components/LetterPronounceText.jsx';

const defaultQuestion = {
  questionText: 'Which word matches the picture?',
  imageUrl:
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
  options: ['dog', 'bird', 'fish', 'lion'],
  correctAnswer: 'dog',
  audioUrl: ''
};

function PictureMcqGame({
  question = defaultQuestion,
  questionNumber = 1,
  totalQuestions = 5,
  selectedAnswer,
  onAnswer,
  disabled = false
}) {
  const [internalAnswer, setInternalAnswer] = useState(null);

  const activeAnswer = selectedAnswer ?? internalAnswer;
  const isAnswered = Boolean(activeAnswer);
  const isCorrect = isAnswered && activeAnswer === question.correctAnswer;

  const status = useMemo(() => {
    if (!isAnswered) {
      return {
        title: 'Pick the correct word',
        subtitle: 'Look at the picture carefully and tap one answer.',
        score: '?',
        accentClassName: 'from-sky-500 via-cyan-500 to-teal-400'
      };
    }

    if (isCorrect) {
      return {
        title: 'Correct answer',
        subtitle: 'Great job. You matched the picture with the right word.',
        score: 10,
        accentClassName: 'from-emerald-500 via-lime-500 to-amber-400'
      };
    }

    return {
      title: 'Try again',
      subtitle: `The correct word is "${question.correctAnswer}".`,
      score: 0,
      accentClassName: 'from-rose-500 via-orange-500 to-amber-400'
    };
  }, [isAnswered, isCorrect, question.correctAnswer]);

  const handleOptionSelect = (option) => {
    if (disabled) {
      return;
    }

    if (selectedAnswer === undefined) {
      setInternalAnswer(option);
    }

    onAnswer?.({
      selectedAnswer: option,
      correctAnswer: question.correctAnswer,
      isCorrect: option === question.correctAnswer,
      isComplete: true
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]">
      <QuestionCard
        title={`Picture Question ${questionNumber}/${totalQuestions}`}
        prompt={question.questionText}
        helperText="Tap the word that best matches the picture."
        imageUrl={question.imageUrl}
        audio={
          question.audioUrl ? (
            <AudioPlayer
              description="Listen to the clue before answering."
              src={question.audioUrl}
              title="Need an audio hint?"
            />
          ) : null
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {question.options.map((option) => (
            <OptionButton
              key=<LetterPronounceText text={option} />
              disabled={disabled}
              isCorrect={isAnswered && option === question.correctAnswer}
              isSelected={activeAnswer === option}
              isWrong={isAnswered && activeAnswer === option && option !== question.correctAnswer}
              onClick={() => handleOptionSelect(option)}
            >
              <LetterPronounceText text={option} />
            </OptionButton>
          ))}
        </div>
      </QuestionCard>

      <div className="space-y-5">
        <ScoreCard
          accentClassName={status.accentClassName}
          score={status.score}
          stats={[
            { label: 'Question', value: `${questionNumber}/${totalQuestions}` },
            { label: 'Choices', value: String(question.options.length) },
            { label: 'Mode', value: 'Picture MCQ' }
          ]}
          subtitle={status.subtitle}
          title={status.title}
        />
        <div className="rounded-[2rem] bg-gradient-to-br from-fuchsia-100 via-white to-sky-100 p-5 shadow-lg">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-fuchsia-600">
            Learning tip
          </p>
          <p className="mt-3 text-xl font-black leading-9 text-ink">
            Say the word out loud after you choose it. Hearing and reading together helps memory.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PictureMcqGame;
