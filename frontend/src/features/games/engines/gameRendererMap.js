import FillInTheBlanksGame from '../game-types/FillInTheBlanksGame.jsx';
import JumbledLettersGame from '../game-types/JumbledLettersGame.jsx';
import LetterPronunciationGame from '../game-types/LetterPronunciationGame.jsx';
import MatchColumnGame from '../game-types/MatchColumnGame.jsx';
import PictureMcqGame from '../game-types/PictureMcqGame.jsx';
import PronunciationSelectionGame from '../game-types/PronunciationSelectionGame.jsx';
import SentenceFormationGame from '../game-types/SentenceFormationGame.jsx';
import SpellingCorrectionGame from '../game-types/SpellingCorrectionGame.jsx';

export const gameRendererMap = {
  picture_mcq: PictureMcqGame,
  letter_recognition: PictureMcqGame,
  match_column: MatchColumnGame,
  alphabet_matching: MatchColumnGame,
  pronunciation_selection: PronunciationSelectionGame,
  sound_identification: PronunciationSelectionGame,
  jumbled_letters: JumbledLettersGame,
  word_builder: JumbledLettersGame,
  letter_pronunciation: LetterPronunciationGame,
  sentence_formation: SentenceFormationGame,
  fill_in_the_blanks: FillInTheBlanksGame,
  spelling_correction: SpellingCorrectionGame
};
