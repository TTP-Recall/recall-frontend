import { useEffect, useState } from "react";
import FolderCard from "../components/Foldercard/foldercard";
import { getFolders, deleteFolder } from "../api/folders";
import CreateFolder from "../components/CreateFolder/CreateFolder";

export default function FoldersPage() {
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFolders() {
      try {
        const data = await getFolders();
        setFolders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadFolders();
  }, []);

  function handleCreated(folder) {
    setFolders((fol) => [...fol, folder]);
}

function handleUpdated(updatedFolder) {
    setFolders((prev) =>
        prev.map((folder) =>
            folder.id === updatedFolder.id
                ? updatedFolder
                : folder
        )
    );
}

  async function handleDelete(id) {
    try {
      await deleteFolder(id);
      setFolders((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(`Could not delete folder: ${err.message}`);
    }
  }

  if (isLoading) return <p>Loading folders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section>
      <h1>Folders</h1>
    
      {folders.length === 0 && <p>No folders yet — create one to get started.</p>}
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          id={folder.id}
          name={folder.name}
          category="Folder"
          noteCount={0}
          openedAgo="—"
          onDelete={handleDelete}
          onUpdated={handleUpdated}
        />
      
      ))}

      <CreateFolder onCreated={handleCreated} />

    </section>
  );
}