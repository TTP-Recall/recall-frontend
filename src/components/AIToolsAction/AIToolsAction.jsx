import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Sparkles, WandSparkles, Layers3, Mic } from "lucide-react";

function AIToolsAction({onFormat, onGenFlashcard, onTranscribe}) {
  return (
    <Popover>
      <PopoverTrigger
        className="
          fixed bottom-6 right-6 z-50
          flex h-14 w-14 items-center justify-center
          rounded-full
          bg-linear-to-br from-violet-500 via-purple-500 to-blue-500
          text-white
          shadow-lg shadow-purple-500/40
          transition-all duration-200
          hover:scale-105
          hover:shadow-xl hover:shadow-purple-500/50
          focus:outline-none
          focus:ring-2 focus:ring-purple-400
          focus:ring-offset-2
        "
      >
        <Sparkles className="h-5 w-5" />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="top"
        sideOffset={12}
        className="w-80 p-2"
      >
        {/* Header */}
        <div className="px-3 pb-3 pt-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />

            <h3 className="font-semibold">Recall AI</h3>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            AI-powered tools for your notes
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="h-auto w-full justify-start px-3 py-3"
            onClick={onFormat}
          >
            <WandSparkles className="mr-3 h-5 w-5" />

            <div className="text-left">
              <div className="font-medium">Format Notes</div>

              <div className="text-xs text-muted-foreground">
                Organize and structure your notes
              </div>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="h-auto w-full justify-start px-3 py-3"
            onClick={onGenFlashcard}
          >
            <Layers3 className="mr-3 h-5 w-5" />

            <div className="text-left">
              <div className="font-medium">Generate Flashcards</div>

              <div className="text-xs text-muted-foreground">
                Create cards to study from your notes
              </div>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="h-auto w-full justify-start px-3 py-3"
            onClick={onTranscribe}
          >
            <Mic className="mr-3 h-5 w-5" />

            <div className="text-left">
              <div className="font-medium">Transcribe</div>

              <div className="text-xs text-muted-foreground">
                Turn a recording into notes
              </div>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AIToolsAction;
