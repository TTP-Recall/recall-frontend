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
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  DiffSourceToggleWrapper,

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

function NoteEditor() {
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState('Untitled')
  const editorRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ 
    audio: true,
    onStop: async (blobUrl, blob) => {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const response = await fetch("http://localhost:8080/api/ai/transcribe", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const transcription = await response.json();
      editorRef.current?.setMarkdown(transcription)
      setMarkdown(transcription)
    }
  });
  

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/notes/${id}`, {
          credentials: "include",
        });
        const data = await response.json();
        const content = data?.content || "";
        setMarkdown(content);
        setTitle(data.title)
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
    setMarkdown(data.content);
    setTitle(data.title)
  }

  async function handleDelete() {
    await fetch(`http://localhost:8080/api/notes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    navigate("/notes");
  }

  async function handleAiFormat() {
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
    console.log(data)
    
    if (data?.formattedContent) {
      // Update the editor visually and React state
      editorRef.current?.setMarkdown(data.formattedContent);

      // TODO: Consider showing AI changes in a separate review view
      // so the user can review and save them if desired.
      setMarkdown(data.formattedContent);
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

  return (
    <section className="note-editor">
      <button onClick={handleMicClick}>
        {status === 'recording' ? <LuMicOff size={35}/> : <LuMic size={35}/>}
      </button>
      <button className="btn" onClick={handleAiFormat}>Polish Note</button>
      <div className="note-actions">
        <DeleteButton onDelete={handleDelete} />
        <Button onClick={handleSave} text="Save Changes" variant="save" />
      </div>

      <MDXEditor
        markdown=""
        ref={editorRef}
        contentEditableClassName="prose max-w-none"
        onChange={(value) => setMarkdown(value)}
        plugins={[
          headingsPlugin(),
          quotePlugin(),
          listsPlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          diffSourcePlugin({ viewMode: "rich-text" }),

          // Code blocks
          codeBlockPlugin({
            defaultCodeBlockLanguage: "js",
          }),

          codeMirrorPlugin({
            codeBlockLanguages: {
              js: "JavaScript",
              css: "CSS",
              jsx: "React",
            },
          }),

          // Clean toolbar without extra wrapper divs
          toolbarPlugin({
            toolbarClassName: "toolbar",
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <BlockTypeSelect />
                <CodeToggle />
                <CreateLink />
                <InsertTable />
                <InsertThematicBreak />
                <InsertCodeBlock />
                <DiffSourceToggleWrapper />
              </>
            ),
          }),
        ]}
      />

      <input
        type="text"
        className="note-title-input"
        placeholder="Untitled note"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </section>
  );
}

export default NoteEditor;