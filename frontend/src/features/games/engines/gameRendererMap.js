import JumbledLettersGame from '../game-types/JumbledLettersGame.jsx';
import LetterPronunciationGame from '../game-types/LetterPronunciationGame.jsx';
import MatchColumnGame from '../game-types/MatchColumnGame.jsx';
import PictureMcqGame from '../game-types/PictureMcqGame.jsx';
import PronunciationSelectionGame from '../game-types/PronunciationSelectionGame.jsx';

export const gameRendererMap = {
  picture_mcq: PictureMcqGame,
  match_column: MatchColumnGame,
  pronunciation_selection: PronunciationSelectionGame,
  jumbled_letters: JumbledLettersGame,
  letter_pronunciation: LetterPronunciationGame
};
