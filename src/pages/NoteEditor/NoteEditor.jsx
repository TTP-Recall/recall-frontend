import {
  MDXEditor,
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  diffSourcePlugin,

  // Toolbar
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CodeToggle,
  ListsToggle,
  CreateLink,
  // InsertTable,
  // InsertThematicBreak,
  // InsertCodeBlock,
  // DiffSourceToggleWrapper,

  // Code blocks
  codeBlockPlugin,
  codeMirrorPlugin,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import Button from "../../components/Button/Button";
import "./NoteEditor.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useReactMediaRecorder } from "react-media-recorder";
import { LuMic } from "react-icons/lu";
import { LuMicOff } from "react-icons/lu";
import { FlashcardArray } from "react-quizlet-flashcard";
import AIToolsAction from "../../components/AIToolsAction/AIToolsAction";
import FlashcardModal from "@/components/FlashcardModal/FlashcardModal";
import SpinnerEmpty from "@/components/Spinner/SpinnerEmpty";
import FolderPicker from "../../components/FolderPicker/FolderPicker";

function NoteEditor() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [flashcards, setFlashcards] = useState(null);
  const [flashcardsOpen, setFlashcardsOpen] = useState(false);
  const [folderId, setFolderId] = useState(null);
  const editorRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStop: async (blobUrl, blob) => {
        await handleTranscription(blob);
      },
    });

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/notes/${id}`, {
          credentials: "include",
        });
        const data = await response.json();
        const content = data?.content || "";
        setContent(content);
        setTitle(data.title);
        setFolderId(data.folderId || null);
        editorRef.current?.setMarkdown(content);
      } catch (error) {
        console.error("Failed to fetch note:", error);
      }
    };

    fetchNote();
  }, [id]);

  async function handleSave() {
    const currentContent = editorRef.current?.getMarkdown() || "";
    const response = await fetch(`http://localhost:8080/api/notes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: currentContent,
        title: title,
      }),
    });

    const data = await response.json();
    setContent(data.content);
    setTitle(data.title);
  }

  async function handleDelete() {
    await fetch(`http://localhost:8080/api/notes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    navigate("/notes");
  }

  async function handleAssignFolder(folderId) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notes/${id}/folder`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ folderId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to assign folder");
      }

      setFolderId(folderId);
    } catch (error) {
      console.error("Failed to assign folder:", error);
    }
  }

  async function handleAiFormat() {
    setIsAiLoading(true);

    try {
      const currentContent = editorRef.current?.getMarkdown() || "";

      const response = await fetch("http://localhost:8080/api/ai/format", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          markdownText: currentContent,
        }),
      });

      const data = await response.json();

      if (data?.formattedContent) {
        editorRef.current?.setMarkdown(data.formattedContent);
        setContent(data.formattedContent);
      }
    } catch (error) {
      console.error("Failed to format note:", error);
    } finally {
      setIsAiLoading(false);
    }
  }
  const handleMicClick = () => {
    // if we click the button and we are recording - Stop recording
    if (status === "recording") {
      stopRecording();
    } else {
      startRecording();
    }
  };
  const handleGenFlashcards = async () => {
    setIsAiLoading(true);

    try {
      const currentContent = editorRef.current?.getMarkdown() || "";

      const response = await fetch("http://localhost:8080/api/ai/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          markdownText: currentContent,
        }),
      });

      const data = await response.json();

      const flashcards = JSON.parse(data.formattedContent);

      setFlashcards(flashcards);
      setFlashcardsOpen(true);

      navigate("/note/flashcards", {
        state: { flashcards },
      });
    } catch (error) {
      console.error("Failed to generate flashcards:", error);
    } finally {
      setIsAiLoading(false);
    }
  };
  const handleTranscription = async (blob) => {
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    const response = await fetch("http://localhost:8080/api/ai/transcribe", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const transcription = await response.json();
    const currentMarkdown = editorRef.current?.getMarkdown() || "";
    const combinedMarkdown = `${currentMarkdown}\n\n${transcription}`;

    editorRef.current?.setMarkdown(combinedMarkdown);
    setContent(combinedMarkdown);
  };

  return (
    <section className="note-editor">
      {isAiLoading ? (
        <SpinnerEmpty />
      ) : (
        <>
          <MDXEditor
            placeholder="Start typing..."
            markdown={content}
            ref={editorRef}
            contentEditableClassName="prose max-w-none"
            onChange={(value) => setContent(value)}
            plugins={[
              headingsPlugin(),
              quotePlugin(),
              listsPlugin(),
              thematicBreakPlugin(),
              markdownShortcutPlugin(),
              diffSourcePlugin({ viewMode: "rich-text" }),
              codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
              codeMirrorPlugin({
                codeBlockLanguages: {
                  js: "JavaScript",
                  css: "CSS",
                  jsx: "React",
                },
              }),
              toolbarPlugin({
                toolbarClassName: "custom-toolbar-wrapper",
                toolbarContents: () => (
                  <div className="custom-toolbar">
                    <div className="toolbar-group">
                      <UndoRedo />
                      <div className="toolbar-divider" />
                      <BoldItalicUnderlineToggles />
                      <div className="toolbar-divider" />
                      <BlockTypeSelect />
                      <ListsToggle />
                      <CodeToggle />
                      <CreateLink />
                    </div>

                    <div className="toolbar-spacer" />

                    <div className="toolbar-group right-actions">
                      <span className="last-edited-text">{}</span>

                      <FolderPicker onAssign={handleAssignFolder} currentFolderId={folderId}/>

                      <DeleteButton onDelete={handleDelete} />

                      <Button
                        onClick={handleSave}
                        text="Save Changes"
                        variant="save"
                      />

                      <div className="toolbar-divider" />

                      <button onClick={handleMicClick}>
                        {status === "recording" ? (
                          <LuMicOff color="green" size={25} />
                        ) : (
                          <LuMic size={25} />
                        )}
                      </button>
                    </div>
                  </div>
                ),
              }),
            ]}
          />

          <input
            type="text"
            className="note-title-input"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <AIToolsAction
            onFormat={handleAiFormat}
            onGenFlashcard={handleGenFlashcards}
            onTranscribe={handleMicClick}
          />
        </>
      )}
    </section>
  );
}

export default NoteEditor;
