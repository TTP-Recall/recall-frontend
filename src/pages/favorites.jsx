import { useEffect, useState } from "react"
import { Link } from "react-router"
import { CgFileDocument } from "react-icons/cg"

function Favorites() {
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        async function fetchFavorites() {
            const response = await fetch(
                'http://localhost:8080/api/notes',
                {
                    method: 'GET',
                    credentials: 'include'
                }
            )

            const data = await response.json()

            setFavorites(
                data.filter(note => note.isFavorite === true)
            )
        }

        fetchFavorites()
    }, [])

    return (
        <section>
            <div className="content-wrapper">
            
            </div>

            <hr />

            <div className="note-container content-wrapper">

                {favorites.length === 0 && (
                    <p>No favorite notes yet.</p>
                )}

                {favorites.map((note) => (
                    <Link
                        to={`/note/${note.id}/edit`}
                        key={note.id}
                        className="note-link"
                    >
                        <div className="note-card">

                            <div className="note-header">

                                <div className="note-icon">
                                    <CgFileDocument
                                        size={25}
                                        style={{ color: "#facc15" }}
                                    />
                                </div>

                                <div className="note-title">
                                    <h3>
                                        {note.title
                                            ? note.title
                                            : 'Untitled'}
                                    </h3>
                                </div>

                            </div>

                            <div className="note-body">
                                <p>{note.description}</p>
                            </div>

                        </div>
                    </Link>
                ))}

            </div>
        </section>
    )
}

export default Favorites