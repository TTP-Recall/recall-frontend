import { useState } from "react";

function EditButton({ folderId, folderName, onUpdated }) {
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(folderName);

    function handleChange(e) {
        setNewName(e.target.value);
    }

   async function handleSubmit(e) {
    e.preventDefault();

    console.log("Folder ID:", folderId);
    console.log("New name:", newName);

    try {
        const response = await fetch(
            `http://localhost:8080/api/folders/${folderId}`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newName,
                }),
            }
        );

        console.log("Status:", response.status);

        const data = await response.json();

        console.log("Backend response:", data);

        if (!response.ok) {
            throw new Error(data.error || "Failed to edit folder");
        }

        onUpdated(data);

        setEditing(false);

    } catch (error) {
        console.error("Error editing folder:", error);
    }
}


   if (editing) {
    return (
        <form onSubmit={handleSubmit}>
            <input
                value={newName}
                onChange={handleChange}
                autoFocus
            />
        </form>
    );
}

    return (
        <button onClick={() => setEditing(true)}>
            Edit
        </button>
    );
}

export default EditButton;