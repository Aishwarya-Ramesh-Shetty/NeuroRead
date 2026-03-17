function rotateArray(items) {
  if (items.length <= 1) {
    return items;
  }

  return [...items.slice(1), items[0]];
}

export function normalizeQuestionByGameType(gameType, question) {
  const options = Array.isArray(question.options) ? question.options : [];

  if (gameType === 'picture_mcq') {
    return {
      ...question,
      options
    };
  }

  if (gameType === 'match_column') {
    const leftItems = options.map((option, index) => ({
      id: `left-${index}`,
      label: option
    }));
    const rightItems = rotateArray(options).map((option, index) => ({
      id: `right-${index}`,
      label: option
    }));
    const correctMatches = leftItems.reduce((accumulator, item) => {
      const matchingRight = rightItems.find((rightItem) => rightItem.label === item.label);
      accumulator[item.id] = matchingRight?.id;
      return accumulator;
    }, {});

    return {
      ...question,
      leftItems,
      rightItems,
      correctMatches
    };
  }

  if (gameType === 'pronunciation_selection') {
    return {
      ...question,
      options
    };
  }

  if (gameType === 'jumbled_letters') {
    return {
      ...question,
      shuffledLetters: options.length ? options : String(question.correctAnswer || '').split('')
    };
  }

  if (gameType === 'letter_pronunciation') {
    const soundOptions = options.map((option, index) => ({
      id: `sound-${index}`,
      label: option,
      spokenText: option
    }));
    const correctOption = soundOptions.find((option) => option.label === question.correctAnswer);

    return {
      ...question,
      letter: question.correctAnswer || options[0] || '?',
      soundOptions,
      correctAnswer: correctOption?.id ?? soundOptions[0]?.id ?? null
    };
  }

  return question;
}

export function isAnswerComplete(gameType, question, answerPayload) {
  if (!answerPayload) {
    return false;
  }

  if (gameType === 'match_column') {
    return (
      Object.keys(answerPayload.selectedAnswer ?? {}).length === (question.leftItems?.length ?? 0)
    );
  }

  if (gameType === 'jumbled_letters') {
    return (
      (answerPayload.selectedAnswer?.length ?? 0) ===
      (question.shuffledLetters?.length ?? question.correctAnswer?.length ?? 0)
    );
  }

  return Boolean(answerPayload.selectedAnswer);
}
