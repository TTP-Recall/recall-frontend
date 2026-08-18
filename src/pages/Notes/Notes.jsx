import { useEffect, useState } from "react";
import "./Notes.css";
import { Link } from "react-router";
import { CgFileDocument } from "react-icons/cg";
import { CiStar } from "react-icons/ci";

const colors = [
  "#007aff",
  "#10b981",
  "#f43f5e",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
];

function Notes() {
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await fetch("http://localhost:8080/api/notes", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        const notesWithColors = data.map((note) => ({
          ...note,
          iconColor: colors[Math.floor(note.id % colors.length)],
        }));

        setNotes(notesWithColors);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    }

    fetchNotes();
  }, []);

  async function handleFavorite(e, note) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(
        `http://localhost:8080/api/notes/${note.id}/favorite`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const updatedNote = await response.json();

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.id
            ? {
                ...updatedNote,
                iconColor: note.iconColor,
              }
            : note,
        ),
      );
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  }

  return (
    <section>
      <div className="content-wrapper">
        <input type="text" className="note-search" placeholder="Find note" />
      </div>

      <hr />

      <div className="note-container content-wrapper">
        {notes &&
          notes.map((note) => (
            <Link
              to={`/note/${note.id}/edit`}
              key={note.id}
              className="note-link"
            >
              <div className="note-card">
                <div className="note-header">
                  <div
                    className="note-icon"
                    style={{
                      backgroundColor: note.iconColor,
                      color: "white",
                    }}
                  >
                    <CgFileDocument size={25} />
                  </div>

                  <div className="note-title">
                    <h3>{note.title ? note.title : "Untitled"}</h3>
                  </div>

                  <div className="note-favorite">
                    <CiStar
                      size={22}
                      onClick={(e) => handleFavorite(e, note)}
                      color={note.isFavorite ? "gold" : "black"}
                    />
                  </div>
                </div>

                <div className="note-body">
                  <p>{note.description}</p>
                </div>

                <div className="note-tags">
                  <span className="note-tag">#sample tag</span>
                  <span className="note-tag">#sample tag #2</span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}

export default Notes;
