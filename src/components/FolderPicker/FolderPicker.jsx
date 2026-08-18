import { useEffect, useState } from "react";
import { getFolders } from "../../api/folders";
import "./FolderPicker.css";

// A folder icon button. Click it to open a small dropdown listing the
// user's folders. Clicking a folder in the list calls onAssign(folderId).
function FolderPicker({ currentFolderId, onAssign }) {
  const [isOpen, setIsOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadFolders() {
      setIsLoading(true);
      try {
        const data = await getFolders();
        setFolders(data);
      } catch (err) {
        console.error("Failed to load folders:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFolders();
  }, [isOpen]);

  function handlePick(folderId) {
    setIsOpen(false);
    onAssign(folderId);
  }

  return (
    <div className="folder-picker">
      <button
        className="folder-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Move to folder"
      >
        📁
      </button>

      {isOpen && (
        <div className="folder-picker-menu">
          {isLoading && <div className="folder-picker-item">Loading...</div>}

          {!isLoading && folders.length === 0 && (
            <div className="folder-picker-item">No folders yet</div>
          )}

          {!isLoading &&
            folders.map((folder) => (
              <button
                key={folder.id}
                className={
                  "folder-picker-item" +
                  (folder.id === currentFolderId ? " active" : "")
                }
                onClick={() => handlePick(folder.id)}
              >
                {folder.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default FolderPicker;