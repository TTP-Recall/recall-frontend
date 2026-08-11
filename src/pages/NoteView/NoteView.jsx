import { useParams } from "react-router"
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

function NoteView () {
    const [note, setNote] = useState(null)
    const {id} = useParams()

    useEffect(() => {
        const fetchNote = async () => {
            const response = await fetch(`http://localhost:8080/api/notes/${id}`, {
                credentials: 'include'
            })
            const data = await response.json()
            // const cleanMarkdown = data.content.replace(/^\\|^\\//, '');
            console.log(data)
            setNote(data)
        }
        fetchNote()
    }, [])
    return (
        <div className="prose max-w-none">
            {note && (
            <>
                <h2>{note.title}</h2>
                <ReactMarkdown >{note.content}</ReactMarkdown>
            </>
            )}
        </div>
    )
}

export default NoteView

// prose max-w-none