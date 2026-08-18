import { useLocation } from "react-router";
import { FlashcardArray } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";

function FlashcardViewer() {
  const { state } = useLocation();

  const flashcards = state?.flashcards || [];

  const deck = flashcards.map((card, index) => ({
    id: index + 1,
    front: {
      html: <div>{card.question}</div>,
    },
    back: {
      html: <div>{card.answer}</div>,
    },
  }));

  return <FlashcardArray deck={deck} />;
}

export default FlashcardViewer;