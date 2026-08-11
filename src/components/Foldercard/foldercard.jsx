import { useState } from "react";
import "./foldercard.css";

function FolderCard({ name, category, noteCount, openedAgo }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="folder-card">
      <div className="folder-icon">📁</div>

      <div className="folder-info">
        <h3>{name}</h3>

        <div className="folder-meta">
          <span className="category-dot"></span>
          <span>{category}</span>
          <span>{noteCount} notes</span>
          <span>Opened {openedAgo}</span>
        </div>
      </div>

      <div className="folder-actions">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          ⋯
        </button>

        {menuOpen && (
          <div className="folder-menu">
            <button>Edit</button>
            <button>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FolderCard;