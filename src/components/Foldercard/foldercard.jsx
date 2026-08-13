import { useState } from "react";
import "./foldercard.css";
import EditButton from "../EditButton/EditButton";

function FolderCard({ id, name, category, noteCount, openedAgo, onDelete, onUpdated}) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleDelete() {
    setMenuOpen(false);
    const confirmed = window.confirm(`Delete "${name}"? Notes inside will not be deleted.`);
    if (confirmed) {
      onDelete(id);
    }
  }

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
        <button onClick={() => setMenuOpen(!menuOpen)}>⋯</button>

        {menuOpen && (
          <div className="folder-menu">
            <EditButton
              folderId={id}
              folderName={name}
              onUpdated={onUpdated}
            />
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FolderCard;