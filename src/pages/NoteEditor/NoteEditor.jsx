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
import "./NoteEditor.css";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";

function NoteEditor() {
  const [markdown, setMarkdown] = useState("");
  const editorRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      const response = await fetch(`http://localhost:8080/api/notes/${id}`, {
        credentials: "include",
      });
      const data = await response.json();
      console.log(data)
      // const cleanMarkdown = data.content.replace(/^\\|^\\//, '');
      setMarkdown(data.content);
      editorRef.current?.setMarkdown(data.content);
    };
    fetchNote();
  }, [id]);
  
  async function handleSave() {
    const response = await fetch(`http://localhost:8080/api/notes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: markdown,
      }),
    });

    const data = await response.json();
    setMarkdown(data.content);
  }
  return (
    <section>
      <button className="btn btn-save" onClick={handleSave}>
        Save Changes
      </button>
      <MDXEditor
        markdown=""
        ref={editorRef}
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

          // Toolbar
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
    </section>
  );
}

export default NoteEditor;
