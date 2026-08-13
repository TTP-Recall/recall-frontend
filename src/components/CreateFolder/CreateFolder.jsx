import "./CreateFolder.css"

function CreateFolder({onCreated}) {

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
            onCreated(folder);


      
        } catch (error) {
            console.error(error)
        }
    }

    return (
    
        <button onClick={createFolder}>
            Create Folder
        </button>

    )
}

export default CreateFolder;

