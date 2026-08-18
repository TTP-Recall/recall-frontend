import { useLocation, useNavigate } from "react-router";
import { FlashcardArray } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";
import "./FlashcardViewer.css";

function FlashcardViewer() {
  const { state } = useLocation();
  const navigate = useNavigate();

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

  return (
    <div className="flashcard-viewer">
      <header className="flashcard-viewer-header">
        <button
          className="flashcard-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back to Note
        </button>

        <div className="flashcard-header-content">
          <h1>Study Flashcards</h1>
          <p>Review the key concepts from your notes.</p>
        </div>
      </header>

      <main className="flashcard-study-area">
        <div className="flashcard-study-container">
          {flashcards.length > 0 ? (
            <>
              <FlashcardArray deck={deck} />

              <p className="flashcard-hint">
                Click a card to reveal the answer
              </p>
            </>
          ) : (
            <div className="flashcard-empty">
              <h2>No flashcards available</h2>
              <p>Generate some flashcards from your notes first.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FlashcardViewer;