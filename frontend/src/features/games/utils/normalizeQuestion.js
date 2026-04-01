function rotateArray(items) {
  if (items.length <= 1) return items;
  return [...items.slice(1), items[0]];
}

function normalizeText(value) {
  return String(value ?? '').trim();
}

function parseMatchOption(option, index, fallbackImageUrl) {
  if (typeof option === 'string') {
    return {
      left: option,
      right: option,
      imageUrl: fallbackImageUrl,
      id: `pair-${index}`
    };
  }

  return {
    left: normalizeText(option?.left ?? option?.word ?? option?.text),
    right: normalizeText(option?.right ?? option?.match ?? option?.label ?? option?.word),
    imageUrl: option?.imageUrl || fallbackImageUrl || null,
    id: option?.id ? String(option.id) : `pair-${index}`
  };
}

export function normalizeQuestionByGameType(gameType, question) {
  const options = Array.isArray(question.options) ? question.options : [];
  const payload = question.payload && typeof question.payload === 'object' ? question.payload : {};

  if (gameType === 'picture_mcq' || gameType === 'letter_recognition') {
    return {
      ...question,
      imageUrl: question.imageUrl || payload.imageUrl || null,
      audioUrl: question.audioUrl || payload.audioUrl || null,
      options: options.map((item) => (typeof item === 'string' ? item : item?.label || String(item)))
    };
  }

  if (gameType === 'match_column') {
    const pairs = options.map((option, index) => parseMatchOption(option, index, question.imageUrl || payload.imageUrl || null));

    const leftItems = pairs.map((pair, index) => ({
      id: `left-${index}`,
      label: normalizeText(pair.left)
    }));

    const rightItems = rotateArray(pairs).map((pair, index) => ({
      id: `right-${index}`,
      label: normalizeText(pair.right || pair.left),
      imageUrl: pair.imageUrl || null
    }));

    const correctMatches = leftItems.reduce((acc, item) => {
      const match = rightItems.find(
        (right) => normalizeText(right.label).toLowerCase() === normalizeText(item.label).toLowerCase()
      );
      acc[item.id] = match?.id;
      return acc;
    }, {});

    return { ...question, leftItems, rightItems, correctMatches };
  }

  if (gameType === 'alphabet_matching') {
    const pairs = options.map((option, index) => parseMatchOption(option, index));

    const uppercaseLetters = pairs.map((pair) => normalizeText(pair.left).toUpperCase()).filter(Boolean);
    const lowercaseLetters = pairs.map((pair) => normalizeText(pair.right).toLowerCase()).filter(Boolean);

    const leftItems = uppercaseLetters.map((letter, index) => ({
      id: `left-${index}`,
      label: letter
    }));

    const rotatedLowercase = rotateArray(lowercaseLetters);
    const rightItems = rotatedLowercase.map((letter, index) => ({
      id: `right-${index}`,
      label: letter
    }));

    const correctMatches = leftItems.reduce((acc, item) => {
      const expected = item.label.toLowerCase();
      const match = rightItems.find((right) => right.label === expected);
      acc[item.id] = match?.id;
      return acc;
    }, {});

    return { ...question, uppercaseLetters, lowercaseLetters, leftItems, rightItems, correctMatches };
  }

  if (gameType === 'pronunciation_selection' || gameType === 'sound_identification') {
    return {
      ...question,
      audioUrl: question.audioUrl || payload.audioUrl || null,
      imageUrl: question.imageUrl || payload.imageUrl || null,
      options: options.map((item) => (typeof item === 'string' ? item : item?.label || String(item)))
    };
  }

  if (gameType === 'jumbled_letters' || gameType === 'word_builder') {
    const letters = options.map((x) => normalizeText(x)).filter(Boolean);

    return {
      ...question,
      imageUrl: question.imageUrl || payload.imageUrl || null,
      audioUrl: question.audioUrl || payload.audioUrl || null,
      shuffledLetters: letters.length ? letters : normalizeText(question.correctAnswer).split('')
    };
  }

  if (gameType === 'sentence_formation') {
    return {
      ...question,
      words: options.map((x) => normalizeText(x)).filter(Boolean)
    };
  }

  if (gameType === 'fill_in_the_blanks') {
    return {
      ...question,
      options: options.map((x) => normalizeText(x)).filter(Boolean)
    };
  }

  if (gameType === 'spelling_correction') {
    const incorrectWord = normalizeText(
      question.incorrectWord || payload.incorrectWord || question.questionText.split(':').pop()
    );

    return {
      ...question,
      incorrectWord
    };
  }

  if (gameType === 'letter_pronunciation') {
    const soundOptions = options.map((option, index) => ({
      id: `sound-${index}`,
      label: normalizeText(option),
      spokenText: normalizeText(option)
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
  if (!answerPayload) return false;

  if (gameType === 'match_column' || gameType === 'alphabet_matching') {
    return Object.keys(answerPayload.selectedAnswer ?? {}).length === (question.leftItems?.length ?? 0);
  }

  if (gameType === 'jumbled_letters' || gameType === 'word_builder') {
    return (
      (answerPayload.selectedAnswer?.length ?? 0) ===
      (question.shuffledLetters?.length ?? question.correctAnswer?.length ?? 0)
    );
  }

  return Boolean(answerPayload.selectedAnswer);
}
