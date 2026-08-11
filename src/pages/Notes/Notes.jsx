import { useEffect, useState } from "react"
import './Notes.css'
import { Link } from "react-router"
function Notes() {
    const [notes, setNotes] = useState(null)

    useEffect(() => {
        async function fetchNotes () {
            const response = await fetch('http://localhost:8080/api/notes', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json()

            setNotes(data)
        }
        fetchNotes()
    }, [])

    return (
        <section>
            <div>Search Section</div>
            <input type="text" placeholder="Find note"/>
            <hr />
            <div className="note-container">
                {notes && (
                    notes.map((note) => {
                        return (
                            <Link to={`/note/${note.id}/view`}>
                                <div className="note-card">
                                    <h3>{note.title ? note.title : 'Empty Title'}</h3>
                                </div>
                            </Link>
                        )
                    })
                )}
            </div>
            
        </section>
    )
}

export default Notes