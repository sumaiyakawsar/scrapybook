import { useEffect, useRef } from "react";
import { Rnd } from "react-rnd";

function StickyNote({ el, currentPage, updateCurrentPage, selectedNoteId, setSelectedNoteId }) {
    const contentRef = useRef(null); // Only for the editable div if needed

    return (
        <Rnd
            key={el.id}
            default={{
                x: el.x,
                y: el.y,
                width: el.width || 200,
                height: el.height || 100,
            }}
            onDragStop={(e, d) => {
                const updated = currentPage.elements.map(note =>
                    note.id === el.id ? { ...note, x: d.x, y: d.y } : note
                );
                updateCurrentPage({ elements: updated });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
                const updated = currentPage.elements.map(note =>
                    note.id === el.id
                        ? {
                            ...note,
                            width: ref.style.width,
                            height: ref.style.height,
                            x: position.x,
                            y: position.y,
                        }
                        : note
                );
                updateCurrentPage({ elements: updated });
            }}
            bounds="parent"
            minWidth={100}
            minHeight={100}
        >
            <div className="box-wrapper">
                <div
                    className={`sticky-note ${el.id === selectedNoteId ? "selected" : ""}`}
                    contentEditable
                    suppressContentEditableWarning

                    ref={contentRef}
                    onClick={() => setSelectedNoteId(el.id)}
                    onBlur={(e) => {
                        const updated = currentPage.elements.map(note =>
                            note.id === el.id ? { ...note, content: e.currentTarget.innerText } : note
                        );
                        updateCurrentPage({ elements: updated });
                    }}
                    style={{ backgroundColor: el.color || "#fff8a8" }}
                >{el.content}</div>
                <button
                    className="delete-btn"
                    onClick={() => {
                        const updated = currentPage.elements.filter(note => note.id !== el.id);
                        updateCurrentPage({ elements: updated });
                    }}
                    title="Delete"
                >
                    ×
                </button>
            </div>
        </Rnd>
    );
}

export default StickyNote;
