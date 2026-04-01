function rotateArray(items) {
  if (items.length <= 1) return items;
  return [...items.slice(1), items[0]];
}

function normalizeText(value) {
  return String(value ?? '').trim();
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

  if (gameType === 'alphabet_matching') {
    const pairs = options
      .map((option) => {
        if (option?.left && option?.right) {
          return { left: normalizeText(option.left), right: normalizeText(option.right) };
        }

        const raw = normalizeText(option);
        const [left, right] = raw.includes('-') ? raw.split('-') : [raw.toUpperCase(), raw.toLowerCase()];
        return { left: normalizeText(left), right: normalizeText(right) };
      })
      .filter((pair) => pair.left && pair.right);

    const leftItems = pairs.map((pair, index) => ({ id: `left-${index}`, label: pair.left }));
    const rightItems = rotateArray(pairs).map((pair, index) => ({ id: `right-${index}`, label: pair.right }));
    const correctMatches = leftItems.reduce((acc, left, idx) => {
      const target = rightItems.find((right) => right.label === pairs[idx].right);
      acc[left.id] = target?.id;
      return acc;
    }, {});

    return { ...question, leftItems, rightItems, correctMatches };
  }

  if (gameType === 'match_column') {
    const pairPayload = payload.pairs || payload.items || [];
    const pairs = (pairPayload.length ? pairPayload : options).map((entry, index) => {
      if (typeof entry === 'string') {
        return { word: entry, imageUrl: null };
      }

      return {
        word: entry.word || entry.label || entry.left || options[index] || '',
        imageUrl: entry.imageUrl || entry.image || null
      };
    });

    const leftItems = pairs.map((pair, index) => ({ id: `left-${index}`, label: normalizeText(pair.word) }));
    const rightItems = rotateArray(pairs).map((pair, index) => ({
      id: `right-${index}`,
      label: normalizeText(pair.word),
      imageUrl: pair.imageUrl || question.imageUrl || null
    }));
    const correctMatches = leftItems.reduce((acc, item) => {
      const match = rightItems.find((right) => right.label.toLowerCase() === item.label.toLowerCase());
      acc[item.id] = match?.id;
      return acc;
    }, {});

    return { ...question, leftItems, rightItems, correctMatches };
  }

  if (gameType === 'pronunciation_selection' || gameType === 'sound_identification') {
    return {
      ...question,
      audioUrl: question.audioUrl || payload.audioUrl || null,
      options: options.map((item) => (typeof item === 'string' ? item : item?.label || String(item)))
    };
  }

  if (gameType === 'jumbled_letters' || gameType === 'word_builder') {
    const correct = normalizeText(question.correctAnswer);
    return {
      ...question,
      imageUrl: question.imageUrl || payload.imageUrl || null,
      audioUrl: question.audioUrl || payload.audioUrl || null,
      shuffledLetters: options.length ? options.map((x) => normalizeText(x)) : correct.split('')
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
    return {
      ...question,
      incorrectWord: normalizeText(question.questionText.split(':').pop())
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
    return (answerPayload.selectedAnswer?.length ?? 0) === (question.shuffledLetters?.length ?? question.correctAnswer?.length ?? 0);
  }

  if (gameType === 'sentence_formation') {
    return (answerPayload.selectedAnswer?.length ?? 0) === (question.words?.length ?? 0);
  }

  return Boolean(answerPayload.selectedAnswer);
}
