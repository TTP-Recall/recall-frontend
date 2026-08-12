import { useEffect, useState } from "react"
import './Notes.css'
import { Link } from "react-router"
import { CgFileDocument } from "react-icons/cg";
import { CiStar } from "react-icons/ci";

function Notes() {
    const [notes, setNotes] = useState(null)

    useEffect(() => {
        async function fetchNotes () {
            const response = await fetch('http://localhost:8080/api/notes', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json()
            console.log(data)
            setNotes(data)
        }
        fetchNotes()
    }, [])

    return (
        <section>
            <div className="content-wrapper">
                <input type="text" className="note-search" placeholder="Find note"/>
            </div>
            <hr />
            <div className="note-container content-wrapper">
                {notes && (
                    notes.map((note) => {
                        return (
                            <Link to={`/note/${note.id}/edit`} key={note.id} className="note-link">
                                <div className="note-card">
                                    <div className="note-header">
                                        <div className="note-icon">
                                            <CgFileDocument size={25}/>
                                        </div>
                                        <div className="note-title">
                                            <h3>{note.title ? note.title : 'Untitled'}</h3>
                                        </div>
                                        <div className="note-favorite">
                                            <CiStar size={22} />
                                        </div>
                                    </div>
                                    <div className="note-body">
                                        <p>{note.description}</p>
                                    </div>
                                    <div className="note-tags">
                                        <span className="note-tag">#sample tag</span>
                                        <span className="note-tag">#sample tag #2</span>
                                    </div>
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