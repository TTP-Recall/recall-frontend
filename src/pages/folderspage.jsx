import { useEffect, useState } from "react";
import FolderCard from "../components/Foldercard/foldercard";
import { getFolders } from "../api/folders";

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

  if (isLoading) return <p>Loading folders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section>
      <h1>Folders</h1>

      {folders.length === 0 && <p>No folders yet — create one to get started.</p>}

      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          name={folder.name}
          category="Folder"
          noteCount={0}
          openedAgo="—"
        />
      ))}
    </section>
  );
}