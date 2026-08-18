import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FlashcardViewer from "../FlashcardViewer/FlashcardViewer";
import "./FlashcardModal.css";

function FlashcardModal({ open, onOpenChange, deck }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flashcard-modal !w-[90vw] !max-w-[1200px]">
        <DialogHeader className="flashcard-modal-header">
          <DialogTitle className="flashcard-modal-title">
            Study Flashcards
          </DialogTitle>

          <DialogDescription className="flashcard-modal-description">
            Review the key concepts from your notes.
          </DialogDescription>
        </DialogHeader>

        <div className="flashcard-modal-body">
          <div className="flashcard-viewer-wrapper">
            <FlashcardViewer flashcards={deck} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FlashcardModal;