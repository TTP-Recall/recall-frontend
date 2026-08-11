import FolderCard from "../components/Foldercard/foldercard";

export default function FoldersPage() {
  return (
    <section>
      <h1>Folders</h1>

      <FolderCard
        name="School"
        category="Work"
        noteCount={12}
        openedAgo="2 hours ago"
      />
    </section>
  );
}