import { useState } from "react";
import "./foldercard.css";
import EditButton from "../EditButton/EditButton";
import { CgFolder } from "react-icons/cg";

const colors = [
  "#007aff",
  "#10b981",
  "#f43f5e",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
];

function FolderCard({
  id,
  name,
  category,
  noteCount,
  openedAgo,
  onDelete,
  onUpdated,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const iconColor = colors[id % colors.length];

  function handleDelete() {
    setMenuOpen(false);

    const confirmed = window.confirm(
      `Delete "${name}"? Notes inside will not be deleted.`,
    );

    if (confirmed) {
      onDelete(id);
    }
  }

  return (
    <div className="folder-card">
      <div
        className="folder-icon"
        style={{
          backgroundColor: iconColor,
          color: "white",
        }}
      >
        <CgFolder size={25} />
      </div>

      <div className="folder-info">
        <h3>{name}</h3>

        <div className="folder-meta">
          <span
            className="category-dot"
            style={{ backgroundColor: iconColor }}
          ></span>

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