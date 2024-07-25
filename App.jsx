import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"

export default function App() {
    
    const [notes, setNotes] = React.useState(
        () => JSON.parse(localStorage.getItem("notes")) || []
    )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0]?.id) || ""
    )

    const [tempNoteText, setTempNoteText] = React.useState("")
    

        /**
     * Challenge:
     * 3. Create a useEffect that, if there's a `currentNote`, sets
     *    the `tempNoteText` to `currentNote.body`. (This copies the
     *    current note's text into the `tempNoteText` field so whenever 
     *    the user changes the currentNote, the editor can display the 
     *    correct text.
     * 4. TBA
     */



const currentNote = 
    notes.find(note => note.id === currentNoteId) 
    || notes[0]

const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)


React.useEffect(() => {
    if (currentNote) {
        setTempNoteText(currentNote.body)
    }
}, [currentNote])

React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
}, [notes])


// React.useEffect(() => {
//     const timeoutId = setTimeout(() => {
//         if (tempNoteText !== currentNote.body) {
//             updateNote(tempNoteText)
//         }
//     }, 500)
//     return () => clearTimeout(timeoutId)
// }, [tempNoteText])


React.useEffect(()=>{
    const timeoutId = setTimeout(() => {
        if(tempNoteText !== currentNote.body){
            updateNote(tempNoteText)
        }
    }, 500);

    return () => clearTimeout(timeoutId);
})


function createNewNote() {
    const newNote = {
        id: nanoid(),
        body: "# Type your markdown note's title here",
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
}

function updateNote(text) {
    setNotes(oldNotes => {
        const newArray = []
        for (let i = 0; i < oldNotes.length; i++) {
            const oldNote = oldNotes[i]
            if (oldNote.id === currentNoteId) {
                // Put the most recently-modified note at the top
                newArray.unshift({ ...oldNote, body: text, updatedAt: Date.now() })
            } else {
                newArray.push(oldNote)
            }
        }
        return newArray
    })
}

function deleteNote(event, noteId) {
    event.stopPropagation()
    setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
}

return (
    <main>
        {
            notes.length > 0
                ?
                <Split
                    sizes={[30, 70]}
                    direction="horizontal"
                    className="split"
                >
                    <Sidebar
                        notes={sortedNotes}
                        currentNote={currentNote}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                        deleteNote={deleteNote}
                    />
                    {
                        currentNoteId &&
                        notes.length > 0 &&
                        <Editor
                        tempNoteText={tempNoteText}
                        setTempNoteText={setTempNoteText}
                        />
                    }
                </Split>
                :
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button
                        className="first-note"
                        onClick={createNewNote}
                    >
                        Create one now
            </button>
                </div>

        }
    </main>
)
}
