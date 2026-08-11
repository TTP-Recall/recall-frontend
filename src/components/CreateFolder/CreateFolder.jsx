import { useState } from "react";
import "./CreateFolder.css"

function CreateFolder() {
    const [folders, setFolders] = useState([]);


    async function createFolder() {
        try {
            console.log("hey")
            const response = await fetch("http://localhost:8080/api/folders", {
                method: "POST",
                credentials: "include", //requires auth for fetch
                headers: {
                    "Content-Type": "application/json", // send as json
                },
                
                body: JSON.stringify({
                    name: "New Folder",
                }),
            })
         

            if (!response.ok) {
                throw new Error("Failed to create folder")
            }

            const folder = await response.json()
            console.log("Created folder:", folder)

            setFolders((fol) => [
                ...fol,
                folder
            ]);

      
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>

       
        <button onClick={createFolder}>
            Create Folder
        </button>

        {folders.map((folder) => (
                <div className = "folder" key={folder.id}>
                    {folder.name}
                </div>
            ))}
         </div>
    )
}

export default CreateFolder;

