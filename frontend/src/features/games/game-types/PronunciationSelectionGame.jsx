import { useMemo, useState } from 'react';
import AudioPlayer from '../components/AudioPlayer.jsx';
import OptionButton from '../components/OptionButton.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import LetterPronounceText from '../components/LetterPronounceText.jsx';

const defaultQuestion = {
  questionText: 'Listen to the audio and choose the word that matches the pronunciation.',
  options: ['banana', 'bonana', 'banena', 'bannana'],
  correctAnswer: 'banana',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
};

function PronunciationSelectionGame({
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
        title: 'Listen and choose',
        subtitle: 'Play the audio, then tap the word that sounds correct.',
        score: '?',
        accentClassName: 'from-indigo-500 via-sky-500 to-cyan-400'
      };
    }

    if (isCorrect) {
      return {
        title: 'Excellent listening',
        subtitle: 'You selected the correct pronunciation.',
        score: 10,
        accentClassName: 'from-emerald-500 via-lime-500 to-yellow-400'
      };
    }

    return {
      title: 'Almost there',
      subtitle: `The correct answer was "${question.correctAnswer}". Listen one more time and compare the sound.`,
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
        title={`Pronunciation Question ${questionNumber}/${totalQuestions}`}
        prompt={question.questionText}
        helperText="Use the audio clue and choose the best matching word."
        audio={
          <AudioPlayer
            accentClassName="from-indigo-500 via-violet-500 to-sky-500"
            description="Press play as many times as you need before selecting your answer."
            src={question.audioUrl}
            title="Audio pronunciation"
          />
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
            { label: 'Skill', value: 'Listening' }
          ]}
          subtitle={status.subtitle}
          title={status.title}
        />
        <div className="rounded-[2rem] bg-gradient-to-br from-indigo-100 via-white to-sky-100 p-5 shadow-lg">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-indigo-600">
            Listening tip
          </p>
          <p className="mt-3 text-xl font-black leading-9 text-ink">
            Say each option softly after hearing the audio. Matching sound to text makes the choice
            clearer.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PronunciationSelectionGame;
